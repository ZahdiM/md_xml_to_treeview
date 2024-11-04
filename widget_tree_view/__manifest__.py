# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).
{
    "name": "XML to TreeViewer",
    "summary": """
                This module extends binary field to take XML file as input and display it as a hierarchical tree view on the Odoo formview.
                TREEVIEW
                HIERARCHY
                XML 
                XML TO TREE VIEW
                TREEVIEWER
                odoo app
                .""",
    "author": "Mediod Consulting PVT Ltd",
    "website": "https://mediodconsulting.com",
    "category": "Tools",
    "version": "11.0.1.0.0",
    "license": "LGPL-3",
    'maintainer': 'Zahid Mehmood',
    "images": ["static/description/banner.png"],
    "depends": [
        "base",
        "web",
    ],

    "data": [
        "views/assets.xml",
    ],

    'qweb': [
        "static/src/xml/treeview.xml",
    ],

    # Technical
    'installable': True,
    'auto_install': False,
}
