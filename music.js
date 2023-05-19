/* 
1.render songs
2.scroll top
3.play/pause/seek
4.CD rotate
5.next /prev
6.random
7.next
*/ 
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const CD = $('.cd');
const playing = $('.player');
const playList = $('.playlist');
const progress = $('#progress');
const cdthumb = $('.cd-thumb');
const next = $('.btn-next');
const prev = $('.btn-prev');
const random = $('.btn-random');
const repeat =$('.btn-repeat');
const PLAYER_STORAGE_KEY = 'F8-PLAY';
const app = {
  currentIndex :0,
  playing :false,
  isRandom: false,
  isRepeat: false,
  settings : JSON.parse,
  songs: [
    {
      name: "Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      path: "./Up.mp3",
      image: "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"

    },
    {
      name: "Tu Phir Se Aana",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "./rose.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
    },
    {
      name: "mặt mộc",
      singer: "Raftaar x Brobha V",
      path:
        "matmoc.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "https://mp3.vlcmusic.com/download.php?track_id=14448&format=320",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "https://mp3.vlcmusic.com/download.php?track_id=25791&format=320",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
    },
    {
      name: "Damn",
      singer: "Raftaar x kr$na",
      path:
        "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
      image:
        "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "https://mp3.vlcmusic.com/download.php?track_id=27145&format=320",
      image:"https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
    }
  ],
  render: function () {
  const htmls = this.songs.map((song,index) =>{
    return` 
    <div class="song ${index===this.currentIndex?'active':''}" data-index="${index}">
      <div class="thumb" 
      style="background-image:url('${song.image}')">
      </div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
        </div>
    </div>
    `
  })
 playList.innerHTML = htmls.join('');
  },
  defineProperties: function(){
   Object.defineProperty(this,'currentSong',{
    get: function(){
      return this.songs[this.currentIndex];
    }
   })
  
  },
  handleEvent: function(){
    // xử lý cd quay 
   const cdthumAnimation= cdthumb.animate([
      {transform:'rotate(360deg)'}
    ],
    {
      duration:10000,
      iterations:Infinity
    }
    )
    cdthumAnimation.pause()
    // xử lý sự kiện trượt 
    const _this = this;
    const cdWidth = CD.offsetWidth;
    document.onscroll = function(){
      const scrollTop=window.scrollY;
      const newWidth = cdWidth-scrollTop;
      CD.style.width = newWidth >  0 ? newWidth +'px' : 0;
      CD.style.opacity = newWidth/cdWidth;
    }
// xử lý sự kiện click play 
    const playBTN = $('.btn-toggle-play');
    playBTN.onclick = function(){
     if(_this.playing){
      _this.playing = false;
      audio.pause();
      playing.classList.remove('playing');
      cdthumAnimation.pause()
     }else{
      _this.playing = true;
      audio.play();
      playing.classList.add('playing');
      cdthumAnimation.play();
         }
 
    }
       // xử lý khi tiến độ bài hát thay đổi 
       audio.ontimeupdate = function(){
        const time = Math.floor(audio.currentTime/audio.duration*100);
        progress.value = time ;
       } 
       // xử lý khi tua bài hát 
       progress.onchange = function(e){
       const updateTime=audio.duration*e.target.value/100;
       audio.currentTime = updateTime;
       }
       //click next 
       next.onclick = function(){
        if(_this.isRandom){
          _this.randomBTN();
        }else{
          _this.nextSong();
        }
        audio.play();
        _this.render();
        _this.scrollActiveSong();
       }
       // click prev
       prev.onclick = function(){
        if(_this.isRandom){
          _this.randomBTN();
        }else{
          _this.prevSong();
        }
         audio.play();
         _this.render();
        _this.scrollActiveSong();

       }
       //click random 
       random.onclick = function(){
        _this.isRandom =!_this.isRandom;
        random.classList.toggle('active',_this.isRandom);
       }
       //click repeat
       repeat.onclick = function(){
        _this.isRepeat = !_this.isRepeat ;
        repeat.classList.toggle('active',_this.isRepeat);
       }
       // xử lý sk kết thúc bài hát 
       audio.onended = function(){
        if(_this.isRepeat){
         audio.play();
        }else if(_this.isRandom){
          _this.randomBTN();
        }else{
          next.click();
        }
       }
       //lắng nghe hành vi click vào bài hát 
       playList.onclick = function(e){
        const songnode = e.target.closest('.song:not(.active)');
        if(songnode && !e.target.closest('.option')){
          //xử lý khi click vào song
          if(songnode){
              _this.currentIndex=Number(songnode.getAttribute('data-index'));
              _this.loadCurrentSOng();
              audio.play();
              playing.classList.add('playing');
              _this.render();
          }
          //xử lý khi click vào option
          if(e.target.closest('.option')){
             
          }
        }
       }
    },
    nextSong: function(){
      this.currentIndex++;
      if(this.currentIndex >= this.songs.length){
        this.currentIndex = 0;
      }
      this.loadCurrentSOng()
  },
  prevSong: function(){
    this.currentIndex--;
    if(this.currentIndex < 0){
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSOng()
  },

  loadCurrentSOng:function(){
      const heading = $('header h2');
      const cdthum = $('.cd-thumb');
      const audio = $('#audio');

      heading.textContent = this.currentSong.name;
      cdthum.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.path;
     
  },
 randomBTN:function(){
     let newIndex;
     do{
      newIndex = Math.floor(Math.random() * this.songs.length)
     }while(newIndex == this.currentIndex )
     this.currentIndex = newIndex;
     this.loadCurrentSOng()
    },
    scrollActiveSong :function(){
     setTimeout(()=>{
      $('.song.active').scrollIntoView({behavior:"smooth",block:"center"})
     },300)
    },
  start:function(){
   
//thêm dữ liệu các thuộc tính bài hát 
    this.render()
// lắng nghe sử lý các sự kiện 
    this.handleEvent()
//định nghĩa các thuộc tính cho objective
    this.defineProperties()
//tải thông tin bài hát 
    this.loadCurrentSOng()
    
  }

}
app.start();