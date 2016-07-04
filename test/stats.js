'use strict'

var createContext = require('./util/create-context')
var createREGL = require('../../regl')
var tape = require('tape')

tape('test regl.stats', function (t) {
  setTimeout(function () {
    var gl = createContext(16, 16)
    var regl
    var stats

    //
    // Begin Test stats.bufferCount
    //
    regl = createREGL(gl)
    stats = regl.stats

    t.equals(stats.bufferCount, 0, 'stats.bufferCount==0 at start')

    regl.buffer([1, 2, 3])
    regl.buffer(new Uint16Array([1, 2, 3]))
    regl.buffer(new Float32Array([1, 2, 3, 4]))

    t.equals(stats.bufferCount, 3, 'stats.bufferCount==3 after creating 3 buffers')

    regl.destroy()

    t.equals(stats.bufferCount, 0, 'stats.bufferCount==0 after regl.destroy()')
    //
    // End Test stats.bufferCount
    //

    //
    // Begin Test stats.elementsCount
    //
    regl = createREGL(gl)
    stats = regl.stats

    t.equals(stats.elementsCount, 0, 'stats.elementsCount==0 at start')

    regl.elements([1, 2, 3])
    regl.elements([[1, 2, 3], [5, 6, 7]])
    regl.elements({
      primitive: 'line loop',
      count: 5,
      data: new Uint8Array([0, 2, 4, 1, 3])
    })

    t.equals(stats.bufferCount, 3, 'stats.elementsCount==3 after creating 3 buffers')

    regl.destroy()

    t.equals(stats.elementsCount, 0, 'stats.elementsCount==0 after regl.destroy()')
    //
    // End Test stats.elementsCount
    //

    //
    // Begin Test stats.framebufferCount
    //

    regl = createREGL(gl)
    stats = regl.stats

    t.equals(stats.framebufferCount, 0, 'stats.framebufferCount==0 at start')

    regl.framebuffer({radius: 5})
    regl.framebuffer({width: 2, height: 4, depth: false, stencil: false})

    t.equals(stats.framebufferCount, 2, 'stats.framebufferCount==2 after creating 2 buffers')

    regl.destroy()
    t.equals(stats.framebufferCount, 0, 'stats.framebufferCount==0 after regl.destroy()')
    //
    // End Test stats.framebufferCount
    //

    //
    // Begin Test stats.shaderCount
    //
    regl = createREGL(gl)
    stats = regl.stats

    t.equals(stats.shaderCount, 0, 'stats.shaderCount==0 at start')

    var draw1 = regl({
      frag: `
      precision mediump float;
      void main () { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }`,
      vert: `
      precision mediump float;
      attribute vec2 position;
      void main () {gl_Position = vec4(position, 0, 1); }`,
      attributes: { position: [[-1, 0], [0, -1], [1, 1]] },
      uniforms: { color: [1, 0, 0, 1] },
      count: 3
    })

    var draw2 = regl({
      frag: `
      precision mediump float;
      void main () { gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); }`,
      vert: `
      precision mediump float;
      attribute vec2 position;
      void main () {gl_Position = vec4(position, 0, 1); }`,
      attributes: { position: [[-1, 0], [0, -1], [1, 1]] },
      uniforms: { color: [1, 0, 0, 1] },
      count: 3
    })

    // no matter how many times we draw it, we should only have two shaders.
    draw1()
    draw1()

    draw2()
    draw2()

    t.equals(stats.shaderCount, 2, 'stats.shaderCount==2 after creating 2 calls')

    regl.destroy()
    t.equals(stats.shaderCount, 0, 'stats.shaderCount==0 after regl.destroy()')
    //
    // End Test stats.shaderCount
    //

    //
    // Begin Test stats.textureCount
    //
    regl = createREGL(gl)
    stats = regl.stats

    t.equals(stats.textureCount, 0, 'stats.textureCount==0 at start')

    regl.texture({shape: [16, 16]})
    regl.texture({
      width: 2,
      height: 2,
      data: [
        255, 255, 255, 255, 0, 0, 0, 0,
        255, 0, 255, 255, 0, 0, 255, 255
      ]
    })
    regl.texture([[[0, 255, 0], [255, 0, 0]], [[0, 0, 255], [255, 255, 255]]])
    t.equals(stats.textureCount, 3, 'stats.textureCount==3 after creating 3 textures')

    regl.destroy()
    t.equals(stats.textureCount, 0, 'stats.textureCount==0 after regl.destroy()')
    //
    // End Test stats.textureCount
    //

    //
    // Begin Test stats.cubeCount
    //
    regl = createREGL(gl)
    stats = regl.stats

    t.equals(stats.cubeCount, 0, 'stats.cubeCount==0 at start')
/*
    regl.cube({shape: [16, 16]})
    regl.cube({
      width: 2,
      height: 2,
      data: [
        255, 255, 255, 255, 0, 0, 0, 0,
        255, 0, 255, 255, 0, 0, 255, 255
      ]
    })
    regl.cube([[[0, 255, 0], [255, 0, 0]], [[0, 0, 255], [255, 255, 255]]])
*/
    regl.cube(16)
    regl.cube(
      [[[255, 0, 0, 255]]],
      [[[0, 255, 0, 255]]],
      [[[0, 0, 255, 255]]],
      [[[0, 0, 0, 255]]],
      [[[255, 255, 0, 255]]],
      [[[0, 255, 255, 255]]])
    regl.cube({
      faces: [
        [[[255, 0, 0, 255]]],
        [[[0, 255, 0, 255]]],
        [[[0, 0, 255, 255]]],
        [[[0, 0, 0, 255]]],
        [[[255, 0, 0, 255]]],
        [[[0, 255, 0, 255]]]
      ]
    })

    t.equals(stats.cubeCount, 3, 'stats.cubeCount==3 after creating 3 cubes')

    regl.destroy()
    t.equals(stats.cubeCount, 0, 'stats.cubeCount==0 after regl.destroy()')
    //
    // End Test stats.cubeCount
    //

    createContext.destroy(gl)
    t.end()
  }, 120)
})
