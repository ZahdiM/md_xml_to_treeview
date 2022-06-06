/**
 * Copyright 2018 Modoolar <info@modoolar.com>
 * License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).
 *
 */

odoo.define('tree_viewer', function (require) {
"use strict";
    const FieldBinaryFile = require("web.basic_fields").FieldBinaryFile;
    const field_registry = require('web.field_registry');
    const core = require('web.core');
    const _t = core._t;

    var utils = require('web.utils');

    FieldBinaryFile.include({
        supportedFieldTypes: ['binary'],
        template: 'FieldTreeViewer',
        accepted_file_extensions: 'application/xml',
        /**
         * @override
         */
        init: function () {
            this._super.apply(this, arguments);
            this.TreeViewViewerApplication = false;
        },

        //--------------------------------------------------------------------------
        // Private
        //--------------------------------------------------------------------------

        /**
         * @private
         * @override
         */
        _render: function () {
        debugger;
            var self = this;
            var $pdfViewer = this.$('.o_form_xml_controls').children();
            var $selectUpload = this.$('.o_select_file_button').first();

            if (this.mode === "readonly" && this.value) {
                var fileURI = this._getURI()
                this.setTreeView(fileURI);
            } else {
                if (this.value) {
                    var binSize = utils.is_bin_size(this.value);
                    $pdfViewer.removeClass('o_hidden');
                    $selectUpload.addClass('o_hidden');
                    if (binSize) {
                        var fileURI = this._getURI()
                        this.setTreeView(fileURI);
                    }
                } else {
                    $pdfViewer.addClass('o_hidden');
                    $selectUpload.removeClass('o_hidden');
                    this.setTreeView();
                }
            }
        },
        //--------------------------------------------------------------------------
        // Handlers
        //--------------------------------------------------------------------------

        /**
         * @override
         * @private
         * @param {Event} ev
         */
         _getURI: function (fileURI) {
            var page = this.recordData[this.name + '_page'] || 1;
            if (!fileURI) {
                var queryObj = {
                    model: this.model,
                    field: this.name,
                    id: this.res_id,
                };
                var queryString = $.param(queryObj);
                fileURI = '/web/content?' + queryString;
            }

            var location = "undefined" != typeof window && window.location;
            var baseUrl = location.protocol + "//" + location.host, currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");
            //fileURI = encodeURIComponent(baseUrl+fileURI);
            fileURI = baseUrl+fileURI;
            return fileURI
        },
        on_file_change: function (ev) {
            debugger;
            this._super.apply(this, arguments);
            var files = ev.target.files;
            var self = this;
            if (!files || files.length === 0) {
                return false;
            }
            var file_name = files[0].name

            var fileExtension = ['xml'];
            if ($.inArray(file_name.split('.').pop().toLowerCase(), fileExtension) == -1) {
                var msg = _t("Only allowed formats are :"+fileExtension.join(', '));
                this.do_warn(_t("File upload"), _.str.sprintf(msg));
                return false;
            }
            var fileURI = URL.createObjectURL(files[0]);
            this.setTreeView(fileURI);

        },

        setTreeView: function(fileURI){
            var self = this;
            if(!fileURI){
                self.$('.o_treeview_viewer').css('display','none');
                return;
            }
             $.get(fileURI, function(data) {
                var  json_data= self.xmlToJson(data.firstChild);
                console.log("json_data",json_data);
                var jsTree = self.$('.o_treeview_viewer').jstree({
                    core: {
                      data: json_data
                    }
                });

            });
        },

        xmlToJson: function(xmlNode){
            var self=this;
            return {
                text: xmlNode.firstChild && xmlNode.firstChild.nodeType === 3 ?
                          (xmlNode.firstChild.textContent.trim().length>0?xmlNode.nodeName+"="+xmlNode.firstChild.textContent:xmlNode.nodeName) : xmlNode.nodeName,
                children: [...xmlNode.children].map(childNode => self.xmlToJson(childNode))
            };
        },
        /**
         * Remove the behaviour of on_save_as in FieldBinaryFile.
         *
         * @override
         * @private
         * @param {MouseEvent} ev
         */
        on_save_as: function (ev) {
            ev.stopPropagation();
        }

    });

    var FieldTreeViewer = FieldBinaryFile.extend({
        init: function () {
            this._super.apply(this, arguments);
            this.TreeViewViewerApplication = false;
        },
    });
    field_registry.add("treeviewer", FieldTreeViewer);
    return FieldTreeViewer;
});
