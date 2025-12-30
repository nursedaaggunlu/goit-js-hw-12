import"./assets/modulepreload-polyfill-B5Qt9EMX.js";/* empty css                      */import{S as w,i as l,a as S}from"./assets/vendor-BkVuWn-o.js";const v=document.querySelector(".search-form"),a=document.querySelector(".gallery"),i=document.querySelector(".loader"),n=document.querySelector(".load-more");let o="",d=1,r=0;const q=40,E="53734660-27d678c11e0bffdf5dc1da34e",b="https://pixabay.com/api/",h=new w(".gallery a");i.classList.add("is-hidden");n.classList.add("is-hidden");async function m(s,e){return(await S.get(b,{params:{key:E,q:s,image_type:"photo",orientation:"horizontal",safesearch:!0,page:e,per_page:q}})).data}function p(s){return s.map(({webformatURL:e,largeImageURL:t,tags:c,likes:u,views:f,comments:y,downloads:L})=>`
      <li class="gallery-item">
        <a href="${t}">
          <img src="${e}" alt="${c}" loading="lazy" />
        </a>
        <ul class="gallery-info">
          <li><span>Likes</span><span>${u}</span></li>
          <li><span>Views</span><span>${f}</span></li>
          <li><span>Comments</span><span>${y}</span></li>
          <li><span>Downloads</span><span>${L}</span></li>
        </ul>
      </li>
    `).join("")}function g(s){return Promise.all(s.map(e=>new Promise(t=>{e.complete?t():(e.addEventListener("load",t),e.addEventListener("error",t))})))}v.addEventListener("submit",async s=>{if(s.preventDefault(),o=s.target.elements.searchQuery.value.trim(),!!o){d=1,r=0,a.innerHTML="",n.classList.add("is-hidden"),i.classList.remove("is-hidden");try{const e=await m(o,d);if(r=e.totalHits,e.hits.length===0){l.error({message:"No images found.",position:"topRight"}),i.classList.add("is-hidden");return}a.insertAdjacentHTML("beforeend",p(e.hits));const t=a.querySelectorAll("img");await g([...t]),h.refresh(),i.classList.add("is-hidden"),a.children.length<r&&n.classList.remove("is-hidden")}catch{i.classList.add("is-hidden"),l.error({message:"Something went wrong.",position:"topRight"})}}});n.addEventListener("click",async()=>{d+=1,n.classList.add("is-hidden"),i.classList.remove("is-hidden");try{const s=await m(o,d);a.insertAdjacentHTML("beforeend",p(s.hits));const e=a.querySelectorAll(".gallery-item"),t=e[e.length-s.hits.length],c=t.querySelectorAll("img");await g([...c]),h.refresh(),A(t),a.children.length>=r?l.info({message:"You've reached the end of results.",position:"topRight"}):n.classList.remove("is-hidden")}catch{l.error({message:"Error loading more images.",position:"topRight"})}finally{i.classList.add("is-hidden")}});function A(s){if(!s)return;const{height:e}=s.getBoundingClientRect();window.scrollBy({top:e*2,behavior:"smooth"})}
//# sourceMappingURL=postList.js.map
