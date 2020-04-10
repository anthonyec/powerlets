import assert from 'assert';

import {
  prefixPipe,
  uriComponentPipe,
  formatPipe,
  newlinesPipe
} from '../../../../src/utils/bookpack';

describe('Bookpack', () => {
  describe('prefixPipe', () => {
    describe('pack', () => {
      it('adds prefix to start of string', () => {
        const expectedOutput = 'javascript:(function() { alert("Hey!") })();';
        const input = '(function() { alert("Hey!") })();';

        const output = prefixPipe().pack(input);

        assert.strictEqual(output, expectedOutput);
      });

      it('does not add prefix if one exists at start of string', () => {
        const expectedOutput = 'javascript:(function() { alert("Hey!") })();';
        const input = 'javascript:(function() { alert("Hey!") })();';

        const output = prefixPipe().pack(input);

        assert.strictEqual(output, expectedOutput);
      });

      it('does not add prefix if one exists at start of string with space padding', () => {
        const expectedOutput = 'javascript: (function() { alert("Hey!") })();';
        const input = 'javascript: (function() { alert("Hey!") })();';

        const output = prefixPipe().pack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });

    describe('unpack', () => {
      it('removes prefix from start of string', () => {
        const expectedOutput = '(function() { alert("Hey!") })();';
        const input = 'javascript:(function() { alert("Hey!") })();';

        const output = prefixPipe().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });

      it('removes prefix from start of string with space padding', () => {
        const expectedOutput = '(function() { alert("Hey!") })();';
        const input = 'javascript: (function() { alert("Hey!") })();';

        const output = prefixPipe().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });

      it('does not remove prefix when not at start of string', () => {
        const expectedOutput = '(function() { alert("javascript: ") })();';
        const input = '(function() { alert("javascript: ") })();';

        const output = prefixPipe().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });
  });

  describe('uriComponentPipe', () => {
    describe('pack', () => {
      it('URI encodes the string', () => {
        const expectedOutput =
          '(function()%20%7B%20alert(%22Hey!%22)%3B%20%7D)()%3B';
        const input = '(function() { alert("Hey!"); })();';

        const output = uriComponentPipe().pack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });

    describe('unpack', () => {
      it('URI decodes the string', () => {
        const expectedOutput = '(function() { alert("Hey!"); })();';
        const input = '(function()%20%7B%20alert(%22Hey!%22)%3B%20%7D)()%3B';

        const output = uriComponentPipe().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });
  });

  describe('formatPipe', () => {
    describe('unpack', () => {
      it('beutifies the code', () => {
        const expectedOutput = `(function() {\n    alert("Hey!");\n})();`;
        const input = '(function(){alert("Hey!");})();';
        const output = formatPipe().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });

    describe('pack', () => {
      it('minifies the code', () => {
        const expectedOutput =
          '(function(){function doAlert(){alert("Hey!")}doAlert()})();';
        const input =
          '(function() {\n    function doAlert() {\n      alert("Hey!");\n}    doAlert();\n})();';
        const output = formatPipe().pack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });
  });

  describe('newlinesPipe', () => {
    describe('unpack', () => {
      it('adds newlines from packed comment found at the end of the string', () => {
        const input =
          '(function() {    function doAlert() {      alert("Hey!");    }    doAlert()    doAlert();})();//@n13,38,59,65,66,80,95';
        const expectedOutput =
        '(function() {\n    function doAlert() {\n      alert("Hey!");\n    }\n\n    doAlert()\n    doAlert();\n})();';

        const output = newlinesPipe().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });

    describe('pack', () => {
      it('removes newlines and packs them in a comment at the end of the string', () => {
        const input =
          '(function() {\n    function doAlert() {\n      alert("Hey!");\n    }\n\n    doAlert()\n    doAlert();\n})();';
        const expectedOutput =
          '(function() {    function doAlert() {      alert("Hey!");    }    doAlert()    doAlert();})();//@n13,38,59,65,66,80,95';

        const output = newlinesPipe().pack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });
  });
});
