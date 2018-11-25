import { Injectable } from '@angular/core';
import { fromEvent, from } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';

import Target from './target';

const ADD_PIPE_ACTION = 'itm-dom-registrer-pipe-add';
const RUN_PIPE_ACTION = 'itm-dom-registrer-pipe-run';

const IFRAME_CONTENT = `
<html><body><script>
  const pipes = {};

  function addPipe(e) {
    const id = e.data.id;
    let pipe;
    try {
      pipe = eval(e.data.input);
      if (typeof pipe !== 'function') throw new TypeError('Pipe is not a function');
    }
    catch (err) { console.error('Failed to add pipe. Input: "' + e.data.input + '"', err.message); }
    pipes[id] = pipe;
    e.source.postMessage(
      {id, action: '${ADD_PIPE_ACTION}', created: Boolean(pipe)},
      location.origin
    );
  }

  function runPipe(e) {
    const id = e.data.id;
    let result;
    try { result = pipes[id](e.data.target) }
    catch (err) { console.error('Failed to run pipe.', err); }
    e.source.postMessage(
      {id, action: '${RUN_PIPE_ACTION}', result: result},
      location.origin
    );
  }

  function handleMessage(e) {
    if (e.data.action === '${ADD_PIPE_ACTION}') addPipe(e);
    if (e.data.action === '${RUN_PIPE_ACTION}') runPipe(e);
  }
  window.addEventListener('message', handleMessage, false);
</script></body></html>
`;

interface ItmPipeSandboxMessage {
  id: number;
  action: string;
  [key: string]: any;
}

@Injectable()
export class ItmPipeSandbox {
  private _iframeListenner: (msg: ItmPipeSandboxMessage) => Promise<ItmPipeSandboxMessage>;

  private _initFrame(): Promise<void> {
    const iframe = document.createElement('iframe');
    (iframe as any).style = 'display: none;';
    (iframe as any).sandbox = 'allow-scripts';
    const blob = new Blob([IFRAME_CONTENT], {type: 'text/html'});
    iframe.src = URL.createObjectURL(blob);
    const onLoad = new Promise(resolve => (iframe.onload = resolve));
    document.body.appendChild(iframe);
    return onLoad.then(() => {
      const messages = fromEvent<MessageEvent>(window, 'message').pipe(
        map(e => this._handleIframeMessage(e))
      );
      this._iframeListenner = (msg: ItmPipeSandboxMessage) => {
        const obs = messages.pipe(
          filter((e) => e && e.id === msg.id && e.action === msg.action),
          first()
        );
        iframe.contentWindow.postMessage(msg, '*');
        return obs.toPromise();
      };
    });
  }

  async eval<T extends Object, R>(input: string): Promise<Target.Pipe<T, R>> {
    if (!this._iframeListenner) await this._initFrame();
    const id = Date.now() + Math.random();
    const msg = {id, action: ADD_PIPE_ACTION, input};
    const {created} = await this._iframeListenner(msg);
    if (!created) throw new Error('Failed to register pipe');
    return (target: any) => {
      return from(this._iframeListenner({id, action: RUN_PIPE_ACTION, target})).pipe(
        map(({result}) => result)
      );
    };
  }

  private _handleIframeMessage(e: MessageEvent): ItmPipeSandboxMessage {
    const {data: {action}} = e;
    switch (action) {
      case ADD_PIPE_ACTION:
      case RUN_PIPE_ACTION: return e.data;
      default: return null;
    }
  }
}

export default ItmPipeSandbox;
