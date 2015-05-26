/* jshint node: true */
'use strict';
var path = require('path');
var Funnel = require('broccoli-funnel');

module.exports = {
  name: 'flood-file-picker',

  treeForStyles: function() {
    var stylesheetPath = path.resolve(__dirname, 'app');
    var stylesheetsTree = new Funnel(this.treeGenerator(stylesheetPath), {
      srcDir: 'styles',
      destDir: '/app/styles'
    });
    return stylesheetsTree;
  },
};
