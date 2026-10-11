let situation='';document.querySelectorAll('.pill').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.pill').forEach(x=>x.classList.remove('active'));b.classList.add('active');situation=b.textContent}));function setQuestion(v){document.getElementById('question').value=v+' 상담을 받고 싶습니다.';document.getElementById('consult').scrollIntoView({behavior:'smooth'})}document.querySelectorAll('[data-model]').forEach(b=>b.onclick=()=>setQuestion(b.dataset.model));document.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>setQuestion(b.dataset.topic));const ages={'20':[['코나','첫 차로 고려하기 좋은 도심형 SUV'],['아반떼','출퇴근과 일상에 실용적인 세단'],['아이오닉 5','전기차를 고려하는 운전자에게']],'30':[['투싼','출퇴근과 주말 여행에 두루 활용'],['싼타페','가족과 함께 쓰기 좋은 SUV'],['그랜저','편안한 주행을 원하는 운전자에게']],'40':[['팰리세이드','자녀와 가족 여행에 넉넉한 공간'],['싼타페','가족 중심의 실용적인 SUV'],['그랜저','출퇴근과 일상에서 편안한 세단']],'50':[['그랜저','편안한 승차감과 세련된 디자인'],['팰리세이드','여유로운 공간이 필요한 가족'],['투싼','부담 없이 운전하기 좋은 SUV']],'60':[['그랜저','편안하고 안정적인 세단'],['투싼','다루기 편한 크기의 SUV'],['싼타페','가족과 함께 타기 좋은 SUV']]};const ageImage={'코나':'kona.jpg','아반떼':'avante.jpg','아이오닉 5':'ioniq5.jpg','투싼':'tucson.jpg','싼타페':'santafe.jpg','그랜저':'grandeur.jpg','팰리세이드':'palisade.jpg'};function renderAge(a){const selected=a==='all'?Object.values(ages).flat().filter((x,i,arr)=>arr.findIndex(y=>y[0]===x[0])===i):ages[a];document.getElementById('agebox').innerHTML=selected.map((x,i)=>'<div class="reco"><span class="num">0'+(i+1)+'</span><div class="reco-info"><strong>'+x[0]+'</strong><small>'+x[1]+'</small></div><img class="reco-photo" src="images/'+ageImage[x[0]]+'" alt="'+x[0]+' 차량 이미지" loading="lazy" onerror="this.style.display=\'none\'"></div>').join('')}renderAge('20');document.querySelectorAll('[data-age]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-age]').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderAge(b.dataset.age)});

document.querySelectorAll('[data-model]').forEach(b=>b.addEventListener('click',()=>{const model=b.dataset.model;const select=document.getElementById('interested-model');if([...select.options].some(o=>o.value===model))select.value=model;}));
const consultationForm=document.getElementById('form');
const submitButton=consultationForm.querySelector('button[type="submit"]');
consultationForm.onsubmit=async e=>{
 e.preventDefault();
 if(!situation){alert('상담 유형을 선택해 주세요.');return}
 if(!document.getElementById('agree').checked){alert('개인정보 이용 동의가 필요합니다.');return}
 const name=document.getElementById('name').value.trim();
 const phone=document.getElementById('phone').value.trim();
 const message=document.getElementById('question').value.trim();
 if(!name||!phone){alert('성함과 연락처를 입력해 주세요.');return}
 if(message.length>3000){alert('문의 내용은 3000자 이내로 작성해 주세요.');return}
 const interestedModel=document.getElementById('interested-model').value;
 const budgetRange=document.getElementById('budget-range').value;
 const ageGroup=document.getElementById('age-group').value;
 const region=document.getElementById('region').value;
 const payload={name,phone,consultation_type:situation,interested_model:interestedModel||null,budget_range:budgetRange||null,age_group:ageGroup||null,region:region||null,message:message||null,consent_given:true};
 submitButton.disabled=true;submitButton.textContent='접수 중입니다…';
 try{
  await submitConsultation(payload);
  const submittedAt=new Date().toLocaleString('ko-KR',{timeZone:'Asia/Seoul'});
  document.getElementById('result').textContent='[차량 상담 접수]\n접수 시간: '+submittedAt+'\n성함: '+name+'\n연락처: '+phone+'\n선택 항목: '+situation+'\n관심 차량: '+(interestedModel||'미선택')+'\n희망 구매금액: '+(budgetRange||'미선택')+'\n연령대: '+(ageGroup||'미선택')+'\n지역: '+(region||'미선택')+'\n입력 내용: '+(message||'없음');
  document.getElementById('modal').classList.add('on');
  consultationForm.reset();situation='';
  document.querySelectorAll('.pill').forEach(b=>b.classList.remove('active'));
 }catch(error){
  console.error(error);
  alert('상담 내용이 저장되지 않았습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요. 문제가 계속되면 운영자에게 문의해 주세요.');
 }finally{submitButton.disabled=false;submitButton.textContent='상담 신청하기 →'}
};
document.getElementById('close').onclick=()=>document.getElementById('modal').classList.remove('on');document.getElementById('copy').onclick=async()=>{try{await navigator.clipboard.writeText(document.getElementById('result').textContent);alert('복사했습니다.')}catch(e){alert('직접 복사해 주세요.')}};