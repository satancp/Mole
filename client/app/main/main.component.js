import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';
import ngMaterial from 'angular-material';

export class MainController {
  $http;
  socket;
  awesomeThings = [];
  Upload;
  ifshowprogress = false;
  file;
  alerts = [];
  /*@ngInject*/
  constructor($http, $scope, socket, Upload) {
    this.$http = $http;
    this.socket = socket;
    this.Upload = Upload;
    this.ifshowprogress = false;
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    this.$http.get('/api/ufiles')
      .then(response => {
        this.awesomeThings = response.data;
        this.socket.syncUpdates('thing', this.awesomeThings);
      });
  }

  addFile() {
    this.$http.post('/api/ufiles', {
      filepath: this.file.$ngfName,
      date: new Date(),
      active: true
    });
    this.file = undefined;
    this.$http.get('/api/ufiles')
      .then(response => {
        this.awesomeThings = response.data;
        this.socket.syncUpdates('thing', this.awesomeThings);
        this.alerts.push({msg: 'Upload successfully!'});
      });
  }

  closeAlert(index) {
    this.alerts.splice(index, 1);
  }

  deleteFile(thing) {
    this.$http.delete(`/api/ufiles/${thing._id}`);
    this.$http.get('/api/ufiles')
      .then(response => {
        this.awesomeThings = response.data;
        this.socket.syncUpdates('thing', this.awesomeThings);
      });
  }

  submit() {
    if(this.file) {
      this.ifshowprogress = true;
      this.upload(this.file);
      this.addFile();
    }
  }

  upload(file) {
    this.Upload.upload({
      url: 'api/ufiles/upload',
      data: {file}
    }).then(function(resp) {
      this.ifshowprogress = false;
      console.log(`Success ${resp.config.data.file.name}uploaded. Response:  ${resp.data}`);
    }.bind(this), function(resp) {
      console.log(`Error status: ${resp.status}`);
    }, function(evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 10);
      console.log(`progress: ${progressPercentage}%  ${evt.config.data.file.name}`);
    });
  }
}

export default angular.module('moleApp.main', [uiRouter, ngMaterial])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
