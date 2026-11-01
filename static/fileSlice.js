self.onmessage = function (e) {
    const { file, chunkSize, startChunk, endChunk, totalSize } = e.data;
    const chunks = [];

    for (let i = startChunk; i < endChunk; ++i) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, totalSize);
        const chunk = file.slice(start, end);
        chunks.push(new File([chunk], `${file.name}_part${i}`, { type: file.type }));
    }
    self.postMessage({ chunks });
};