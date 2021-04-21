### 前言
今天我想在我的博客首页中添加一个音乐播放器，但是在开发过程中遇到了一些问题，因此今天写下此博客，记录自己解决问题的过程并分享给大家。

### 关于网易云音乐接口的使用
我这里并非直接使用的网易云音乐api，而是使用的是一个开源的音乐api接口，但其本质也是调用的网易云音乐。[网易云接口连接](https://api.imjad.cn/cloudmusic.md)

我在后台管理系统通过输入音乐ID来调用此接口获取歌曲，并将获取的信息保存到我的数据库中，我原本的想法是前端获取我数据库的信息就能拿到网易云音乐的资源，实现音乐播放，但我发现网易云的url中包含了时间戳，因此我知道我在后台管理系统中保存的url将来可能会是过期的。因此我打算在我博客首页的created()中对其进行处理。首先我先获取我数据库的信息放到vue-aplayer的list中。因为我list中的所有url都将可能是过期的，所以我拿出list[0]的音乐ID调用上述接口获得最新的音乐资源。但是当我播放完第一首歌曲，在播放其他的时候，由于url过期，依然无法继续播放。

### vue-player问题解决
我发现当url无效时，vue-player会触发==error==函数，因此打算在error()中处理。首先我需要获取当前歌曲对象，但是官网文档并没有明确表明如何获取当前歌曲对象，我查了很多资料也并没找到我想要的。然后我通过开始查看vue-aplayer的源码,发现了==update:music==。因此我这样做
```javascript
<aplayer 
	listMaxHeight="100px"
        v-if="flag"
        ref="player"
        :list="list"
        @error="error"
        :music="music"
        showLrc
        :listFolded="true"
        float
        @update:music="getCurrent"
        >
</aplayer>
getCurrent(music){
	this.current=music
},
```
就这样我获取了当前的音乐对象，然后在error()中调用上述接口获取新的url，但是获取倒最新的url后，他并没有重新播放而是一直暂停，我通过观看源码嘴中发现了==onSelectSong()== 这个函数在源码中就是用来播放音乐的函数。

```javascript
async error(){
            this.getCurrent
            const song=await getMusic(`https://api.imjad.cn/cloudmusic/?type=song&id=${this.current.cloudID}&br=128000`)
            if(song&&song.data.code==200){
               this.current.src=song.data.data[0].url
               this.music=this.current
               this.$refs.player.onSelectSong()
            }
 }
```


