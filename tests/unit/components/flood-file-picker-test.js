/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';

describeComponent(
  'flood-file-picker',
  'FloodFilePickerComponent',
  {
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  },
  function() {
    it('renders', function() {
      // creates the component instance
      var component = this.subject();
      expect(component._state).to.equal('preRender');

      // renders the component on the page
      this.render();
      expect(component._state).to.equal('inDOM');
    });

    describe('File List', function () {
      it('should list files by name', function () {
        var component = this.subject();
        component.addFile({name: "first-test-file.jmx"});
        component.addFile({name: "second-test-file.jmx"});

        expect(component.get('listFiles')).to.equal(true);
        expect(component.get('dropzone')).to.equal(true);

        expect(this.$('.FileList').length).to.equal(1);
        expect(this.$('.FileList .File').length).to.equal(2);
        expect(this.$('.File .File-name').first().text()).to.equal('first-test-file.jmx')
        expect(this.$('.File .File-name').last().text()).to.equal('second-test-file.jmx')
      });

      it('hides the file list when listFiles=false', function () {
        var component = this.subject();
        component.set('files', Ember.A([
          {name: "first-test-file.jmx"},
          {name: "second-test-file.jmx"}
        ]));

        component.set('listFiles', false);
        expect(this.$('.FileList').length).to.equal(0);
      });
    });

    describe('addFile', function () {
      it('adds a file model', function () {
        var component = this.subject();
        component.removeFiles();
        var file1 = {name: "first-test-file.jmx", size: 10240};
        component.addFile(file1);
        expect(component.get('files').length).to.equal(1);
      });
    });

    describe('Dragging files', function () {
      it('adds a drag class when a file is dragged over', function () {
        var component = this.subject();
        expect(this.$().hasClass('FilePicker--is-dragging')).to.equal(false);

        Ember.run(this, function() {
          component.trigger('dragEnter', new Event('fakeDrag'));
        });

        expect(this.$().hasClass('FilePicker--is-dragging')).to.equal(true);
      });

      it('removes drag class when dragging out', function () {
        var component = this.subject();
        Ember.run(this, function() {
          component.trigger('dragEnter', new Event('fakeDrag'));
        });
        expect(this.$().hasClass('FilePicker--is-dragging')).to.equal(true);
        Ember.run(this, function() {
          component.trigger('dragLeave', new Event('fakeDrag'));
        });
        expect(this.$().hasClass('FilePicker--is-dragging')).to.equal(false);
      });
    });

    describe('Dropping files', function () {
      it('adds each file to the list', function () {
        var component = this.subject();
        component.removeFiles();
        var files = [{name: "first-test-file.jmx"}];

        Ember.run(this, function() {
          var event = new Event('fakeDrag');
          event.dataTransfer = {files: files};
          component.trigger('drop', event);
        });

        expect(component.get('files.length')).to.equal(1);
      });

      it('should not have progressed yet', function () {
        var component = this.subject();
        component.removeFiles();
        var files = [{name: "first-test-file.jmx"}];

        Ember.run(this, function() {
          var event = new Event('fakeDrag');
          event.dataTransfer = {files: files};
          component.trigger('drop', event);
        });

        expect(component.get('files.firstObject.progressValue')).to.equal(0);
      });


    })
  }
);
