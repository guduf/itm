import PipeSandbox from './pipe_sandbox';
import Target from './target';

describe('ItmPipeSandbox', () => {
  it('should eval a pipe and stream response', done => {
    const sandbox = new PipeSandbox();
    sandbox.eval('size => size + "mm"').then(e => {
      const pipe: Target.Pipe<number, string> = e as any;
      expect(typeof pipe === 'function').toBeTruthy('Expected function');
      const size = 2;
      pipe(size).subscribe(result => {
        expect(result).toBe(size + 'mm', 'Expected piped value');
        done();
      });
    });
  });
});
