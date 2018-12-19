/* eslint-env node */

module.exports = {
  test_page: 'tests/index.html?hidepassed&nocontainer',
  browser_disconnect_timeout: 30,
  parallel: 5,

  launch_in_ci: [
    'Chrome'
  ],
  launch_in_dev: [
    'Chrome'
  ],
  browser_args: {
    Chrome: {
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.CI ? '--no-sandbox' : null,
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--mute-audio',
        '--remote-debugging-port=0',
        '--window-size=1440,900',
        // https://github.com/testem/testem/issues/1021#issuecomment-406263311
        "--proxy-server='direct://'",
        '--proxy-bypass-list=*'
      ].filter(Boolean)
    }
  }

};
