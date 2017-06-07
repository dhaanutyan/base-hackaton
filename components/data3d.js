(function(AFRAME){
  
  AFRAME.registerComponent('base-data3d', {
  
    schema: {
      url: {
        type: 'string',
        default: ''
      },
      key: {
        type: 'string',
        default: ''
      }
    },

    init: function () {
    },

    update: function () {
      var this_ = this
      var url = this_.data.url || this_.data.URL
      var key = this_.data.key || this_.data.KEY

      // check params
      if ((!url || url === '') && (!key || key === '')) return
      
      // remove old mesh
      this_.remove()
      
      // create new one
      this_.mesh = new THREE.Object3D()
      this_.data3dView = new BASE.three.Data3dView({ parent: this_.mesh })
      this.el.data3dView = this.data3dView
      // load 3d file
      ;(key ? BASE.store.get(key) : BASE.data3d.load(url)).then(function(data3d){
        this.el.data3d = data3d
        // update view
        this_.data3dView.set(data3d)
        this_.el.setObject3D('mesh', this_.mesh)
        // emit event
        this_.el.emit('model-loaded', {format: 'data3d', model: this_.mesh});
      })
    },

    remove: function () {
      if (this.data3dView) {
        this.data3dView.destroy()
        this.data3dView = null
      }
      if (this.mesh) {
        this.el.removeObject3D('mesh')
        this.mesh = null
      }
    }

  })
    
})(AFRAME)