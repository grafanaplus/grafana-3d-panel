
import {MetricsPanelCtrl} from  'app/plugins/sdk';

import _ from 'lodash';
import moment from 'moment';
import angular from 'angular';

import * as THREE from './external/three.min';
import * as STATS from './external/stats.min';

class ThreePanelCtrl extends MetricsPanelCtrl {

  constructor($scope, $injector, $q, $rootScope, $timeout, $window, timeSrv, uiSegmentSrv) {
    super($scope, $injector);

    this.$rootScope = $rootScope;
    this.timeSrv = timeSrv;
    this.uiSegmentSrv = uiSegmentSrv;
    this.q = $q;

    this.spot = null;
    this.initalized = false;

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('panel-initialized', this.onPanelInitalized.bind(this));
    this.events.on('refresh', this.onRefresh.bind(this));


    angular.element($window).bind('resize', this.onResize.bind(this) );

    this.onConfigChanged();
  }

  onResize() {
    console.log( 'RESIZE');
  }

  onDataError(err) {
    this.seriesList = [];
    this.render([]);
    console.log("onDataError", err);
  }

  onRefresh() {
    console.log("onRefresh()")

  }

  onInitEditMode() {
    this.addEditorTab('Options', 'public/plugins/natel-threejs-panel/editor.html',1);
    this.editorTabIndex = 1;
    this.refresh();
    this.segs = {
      symbol: this.uiSegmentSrv.newSegment({value: this.panel.pconfig.settings.marker.symbol })
    };
  }

  onSegsChanged() {
    this.panel.pconfig.settings.marker.symbol = this.segs.symbol.value;
    this.onConfigChanged();

    console.log( this.segs.symbol, this.panel.pconfig );
  }

  onPanelInitalized() {
    console.log("onPanelInitalized()")
  }

  onRender() {

/**
    if(!this.initalized && this.spot != null) {
      console.log( "TODO... initalize....", this, THREE);

      var w = 300;
      var h = 300;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 75, w/h, 0.1, 1000 );
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize( w, h );
      
      this.spot.appendChild( this.renderer.domElement );

      var geometry = new THREE.BoxGeometry( 1, 1, 1 );
      var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      var cube = new THREE.Mesh( geometry, material );
      this.scene.add( cube );

      this.camera.position.z = 5;

      var rrr = () => {
        requestAnimationFrame( rrr );

        cube.rotation.x += 0.1;
        cube.rotation.y += 0.1;

        this.renderer.render(this.scene, this.camera);


     // console.log( "FRAME", cube.rotation);
      };
      rrr();

      console.log( "INIT", rrr, w, h);
    }
    else {
      console.log( "REnder... already going... anything?");
    }

    this.sizeChanged = false; 
    this.initalized = true;

    **/

    console.log("onRender");
  }

  onDataReceived(dataList) {
    console.log( 'DATA', dataList );

    this.render();
  }

  onConfigChanged() {
    console.log( "Config changed...");
  }

  animate() {
    requestAnimationFrame( this.animate.bind(this) );
    this.render3D();
  //    this.stats.update();
  }

  render3D() {
    this.cube.rotation.x += 0.1;
    this.cube.rotation.y += 0.1;

    this.renderer.render(this.scene, this.camera);
  }

  link(scope, elem, attrs, ctrl) {
    this.spot = elem.find('.three-spot')[0];
    

    var w = 300;
    var h = 300;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, w/h, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( w, h );
    
    this.spot.appendChild( this.renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.cube = new THREE.Mesh( geometry, material );
    this.scene.add( this.cube );




    //this.stats = new STATS.Stats();
    //this.spot.appendChild( this.stats.dom );



    this.camera.position.z = 5;


    console.log( "INIT", w, h);


    elem.on( 'mousemove', (evt) => {
      this.mouse = evt;
    });


    this.animate();


    console.log("THREE inside link", this.spot);    
  }
}
ThreePanelCtrl.templateUrl = 'module.html';

export {
  ThreePanelCtrl as PanelCtrl
};


