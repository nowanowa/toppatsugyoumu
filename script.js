const syukei = {
  '説明会運営' : {
    name: '説明会運営',
    sum: 0,//600000,
    count: 0,//1,
  },
  '電話対応' : {
    name: '電話対応',
    sum: 0,//120000,
    count: 0,//2,
  },
  '来客対応' : {
    name: '来客対応',
    sum: 0,
    count: 0,//1,
  },
};

function outputRecords(){
  const tbody = document.getElementById('syukei');
  const total = document.getElementById('total');
  const recordTemplate = document.getElementById('record');
  tbody.textContent = '';
  let totalValue = 0;
  for (name in syukei) {
    const record = syukei[name];
    const trElement = recordTemplate.content.cloneNode(true);
    const td = trElement.querySelectorAll('td');
    td[0].textContent = record.name;
    td[1].textContent = hhmmss(record.sum, false);
    td[2].textContent = record.count;
    td[3].textContent = record.count ? hhmmss(Math.floor(record.sum / record.count), false) : '-';
    tbody.appendChild(trElement);
    totalValue += record.sum;
  }
  total.textContent = hhmmss(totalValue, false);
}

function hhmmss(millisec, need){
  const ss = zerofill(Math.floor(millisec / 1000) % 60, 2);
  const mm = zerofill(Math.floor(millisec / 60000) % 60, 2);
  const hh = zerofill(Math.floor(millisec / 3600000) % 24, 2);
  let hhmmss = hh + '時間' + mm + '分' + ss + '秒';

  if (need) hhmmss += '' + zerofill(millisec % 1000, 3);

  return hhmmss;

  function zerofill(number, targetLength) {
    const digit = String(number);
    const diff = targetLength - digit.length;
    if (diff >= 0) {
      return '0'.repeat(diff) + number;
    } else {
      return digit.slice(-diff);
    }
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  /* 読み込み時の処理 */
  outputRecords();
  const bunrui = document.getElementById('bunrui');
  const bunruiButtonTemplate = document.getElementById('bunruiButton');
  for (name in syukei) {
    const record = syukei[name];
    const buttonElement = document.createElement('button');
    buttonElement.textContent = record.name;
    buttonElement.addEventListener('click', updateRecord);
    bunrui.appendChild(buttonElement);
  }
  document.forms.workedFor.other.addEventListener('click', updateRecord);

  document.forms.workedFor.newBunrui.addEventListener('keypress', (event)=>{
    if (event.keyCode === 13) {
      event.preventDefault();
      return false;
    }
  });

  /* 分類をクリックしたときの処理 */
  function updateRecord(event) {
    let name;
    let time = Number(document.forms.workedFor.millisec.value);
    if (event.target.name === 'other') {
      name = document.forms.workedFor.newBunrui.value;
      if (name === '') {
        alert('新分類名を入力してください！');
        return;
      }
        console.log(syukei[name]);
      if (syukei[name] != undefined) {
        alert('すでに存在する分類はそのボタンを押してください！');
        return;
      }
      syukei[name] = {
        name: name,
        sum: time,
        count: 1,
      };
      /* ボタンを追加 */
      const bunrui = document.getElementById('bunrui');
      const bunruiButtonTemplate = document.getElementById('bunruiButton');
      const buttonElement = document.createElement('button');
      buttonElement.textContent = name;
      buttonElement.addEventListener('click', updateRecord);
      bunrui.appendChild(buttonElement);
    } else {
      name = event.target.textContent;
      const bunrui = syukei[name];
      bunrui.sum += time;
      bunrui.count += 1;
    }
    outputRecords();
    document.forms.workedFor.newBunrui.value = '';
    add.hidden = true;
  }

  /* メインタイマーの制御 */
  let tpgm_isRunning = false;
  let tpgm_startTime = 0;
  const btn_startstop = document.getElementById('btn_startstop');
  const watch = document.getElementById('watch');
  const add = document.getElementById('add');
  const time = document.getElementById('time');
  function tpgm_runWatch() {
    watch.textContent = hhmmss(Date.now() - tpgm_startTime, true);
    if (tpgm_isRunning) {
      setTimeout(tpgm_runWatch, 16.6)
    } else {
      watch.textContent = hhmmss(0, true);
    };
  };
  btn_startstop.addEventListener('click', ()=>{
    if (tpgm_isRunning) {
      tpgm_isRunning = false;

      const diff = Date.now() - tpgm_startTime;
      document.forms.workedFor.millisec.value = diff;
      time.textContent = hhmmss(diff, true);
      add.hidden = false;

      btn_startstop.classList.remove('running');
      btn_startstop.textContent = 'はじまった！';
    } else {
      tpgm_startTime = Date.now();
      tpgm_isRunning = true;
      tpgm_runWatch();

      btn_startstop.classList.add('running');
      btn_startstop.textContent = '終わったら押す';
    }
  });

  /* リセットボタン */
  document.getElementById('btn_reset').addEventListener('click', ()=>{
    const ng = !confirm('集計したデータを全て0にします。よろしいですか？');
    if (ng) {
      alert('キャンセルしました。');
      return;
    }
  for (name in syukei) {
    const record = syukei[name];
    record.sum = 0;
    record.count = 0;
  }
    outputRecords();
    alert('リセットしました。');
  });

  /* 分類項目追加ボタン */
  document.getElementById('btn_setting').addEventListener('click', ()=>{
    alert('TODO: 分類項目名をカスタマイズできるようにしなくちゃいけない！');
  });
});
