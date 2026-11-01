var { console, fetch } = this;

const types = {
  type: 'FETCH_BLOB_WIDGET',
  title: '获取网络文件的Blob对象',
  icon: 'https://iftc.koyeb.app/static/fetch_blob_widget_icon.svg',
  version: '1.0.0',
  isInvisibleWidget: true,
  isGlobalWidget: true,
  author: 'IFTC',
  properties: [],
  methods: [
    {
      key: 'fetchBlob',
      label: '获取网络文件的Blob对象',
      params: [
        {
          key: 'url',
          label: 'URL',
          valueType: 'string',
          defaultValue: 'https://iftc.koyeb.app/favicon.ico'
        }
      ],
      tooltip: '将指定URL（支持DataURL和BlobURL）的资源转换为Blob对象'
    }
  ],
  events: [
    {
      key: 'onFetched',
      label: '获取Blob对象',
      params: [
        {
          key: 'blob',
          label: 'blob',
          valueType: 'object'
        }
      ]
    }
  ]
};

class FetchBlobWidget extends InvisibleWidget {
  constructor(props) {
    super(props);
  }

  async fetchBlob(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    console.log(blob)
    this.emit('onFetched', blob)
  }
}

exports.types = types;
exports.widget = FetchBlobWidget;