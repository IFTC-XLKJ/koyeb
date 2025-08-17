(function () {
    globalThis.VED = (function () {
        const parseKey = function (key) {
            const keys = [];
            for (let i = 0; i < key.length; i++) {
                const char = key[i];
                const charCode = char.charCodeAt(0);
                keys.push(charCode);
            }
            return keys;
        };

        function splitByLength(str, length) {
            const regex = new RegExp(`.{1,${length}}`, 'g');
            return str.match(regex) || [];
        }

        function uint32ArrayToBase64(uint32Array) {
            const bytes = new Uint8Array(uint32Array.buffer);
            let binary = '';
            for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        }

        function base64ToUint32Array(base64) {
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return new Uint32Array(bytes.buffer);
        }
        function textToBase64(str) {
            return btoa(unescape(encodeURIComponent(str)));
        }
        return {
            encode: function (text, key) {
                if (!key) throw new Error("Key is required");
                const keys = parseKey(key);
                if (keys.length === 0) throw new Error("Key must not be empty");
                text = textToBase64(key) + text;
                const texts = splitByLength(text, keys.length);
                const result = [];
                for (let i = 0; i < texts.length; i++) {
                    const chunk = texts[i];
                    for (let j = 0; j < chunk.length; j++) {
                        const charCode = chunk[j].charCodeAt(0);
                        result.push(charCode + keys[j]);
                    }
                }
                const uint32array = new Uint32Array(result);
                return uint32ArrayToBase64(uint32array);
            },
            decode: function (encoded, key) {
                if (!key) throw new Error("Key is required");
                const keys = parseKey(key);
                if (keys.length === 0) throw new Error("Key must not be empty");
                const uint32array = base64ToUint32Array(encoded);
                const result = [];
                for (let i = 0; i < uint32array.length; i++) {
                    const j = i % keys.length;
                    const charCode = uint32array[i] - keys[j];
                    result.push(String.fromCharCode(charCode));
                }
                if (result.join("").startsWith(textToBase64(key))) return result.join('').replace(textToBase64(key), "");
                else return null;
            }
        };
    })();
})();