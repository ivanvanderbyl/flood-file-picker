import Ember from 'ember';
import layout from '../templates/components/flood-file-picker';

const {
  Component,
  computed,
  observer,
  run,
  assert,
  $
} = Ember;

const {
  bind
} = run;
const {
  htmlSafe
} = Ember.String;

var FileModel = Ember.Object.extend({
  name: null,
  fileData: null,
  progressValue: 0,

  progressStyle: Ember.computed('progressValue', function() {
    var width = this.get('progressValue') || 0;
    return htmlSafe('width: ' + width + '%;');
  }),

  isComplete: function() {
    return this.get('progressValue') === 100;
  }.property('progressValue'),
});

export default Ember.Component.extend({
  classNames: ['FilePicker'],
  classNameBindings: [
    'multiple:FilePicker--multiple:FilePicker--single',
    'hasFilesDraggedOver:FilePicker--is-dragging'
  ],

  accept: '*',
  multiple: false,

  count: 0,

  layout: layout,
  files: Ember.A(),
  dropzone: true,
  progress: true,
  listFiles: true,

  hasFilesDraggedOver: Ember.computed.gt('count', 0),

  addFile(file) {
    var fileObject = FileModel.create({file: file, name: file.name});
    this.get('files').addObject(fileObject);
  },

  removeFiles() {
    this.set('files', Ember.A());
    this.set('file', null);
  },

  removeFile(file) {
    this.get('files').removeObject(file);
  },

  handleFiles(files) {
    this.removeFiles();
    for (var i = files.length - 1; i >= 0; i--) {
      this.addFile(files[i]);
    };
  },

  /**
   * Change handler for file input. Expects event to bouble up.
   */
  change(event) {
    if (event.target.files) {
      event.preventDefault();
      this.handleFiles(event.target.files || []);
    }
  },

  actions: {
    removeFile(file) {
      this.removeFile(file);
    },

    selectFiles() {
      var clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': false,
        'cancelable': true
      });

      this.get('element').querySelector('input[type="file"]').dispatchEvent(clickEvent);
    }
  },

  /* Drag'n'Drop events */
  dragOver: function(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  },

  drop: function(event) {
    event.preventDefault();
    this.handleFiles(event.dataTransfer.files);
    this.set('count', 0);
  },

  dragEnter: function(event) {
    event.preventDefault();
    this.incrementProperty('count');
  },

  dragLeave: function(event) {
    event.preventDefault();
    var count = this.decrementProperty('count');
  }
});
