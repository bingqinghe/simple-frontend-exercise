var nameList = [];
var score = {};
$.getJSON('https://www.hatchways.io/api/assessment/students', function(data) {
  $.each(data, function(index, value){
    for(let i = 0; i < value.length; i++) {
      var name = value[i].firstName + ' ' + value[i].lastName;
      nameList.push(name.toUpperCase());
      score[i] = value[i].grades;
      var average = value[i].grades.map(item => parseInt(item)).reduce((acc, n) => acc+n, 0) / value[i].grades.length;
      $('#result').append(`
<div class='container' id=${value[i].id}>
<img class='col-xs-1 img-responsive'src='${value[i].pic}'></img>
<h1 class='name'>${name.toUpperCase()}</h1>
<button type='button' class='expand-btn' onClick=expand(this) id='appbutton-${value[i].id}' style='visibility: visible'><i class="fas fa-plus"></i></button>
<button type='button' class='disapper-btn' onClick=hide(this) id='disbutton-${value[i].id}' style='visibility: hidden'><i class="fas fa-minus"></i></button>
<span id='content-${value[i].id}'>
<p class='email'>Email: ${value[i].email}</p>
<p class='company'>Company: ${value[i].company}</p>
<p class='skill'>Skill: ${value[i].skill}</p>
<p class='average'>Average: ${average}%</p>
</span>
<table class='score' id='table-${value[i].id}'></table>
<span class='newtag' id='tagvalue-${value[i].id}'></span>
<lable for='tag'><input type='text' name=
'tag'id='tag-${value[i].id}' class='add-tag-input' onkeypress='addTag(this)' placeholder='Add a tag'>
</div></label>`);
    }
  })
})

function lookUp() {
  let inputName = document.getElementById('name-input').value.toUpperCase();
  let inputTag = document.getElementById('tag-input').value;
  let show = document.getElementsByClassName('container');
  let result = show.length;
  let tags = document.getElementsByClassName('col-xs-3');
  let tagShowContainer = [], inputShowContainer = []; 
  for(let i = 0; i < tags.length; i++) {
    if(tags[i].innerHTML.indexOf(inputTag) != -1) {
      let parentNode = tags[i].parentNode.id.charAt(9);
      tagShowContainer.push(parseInt(parentNode)-1);
    }
  }
  
  for(let i = 0; i < result; i++) {
    let showNameIndex = nameList[i].indexOf(inputName);
    if(showNameIndex != -1) {
      inputShowContainer.push(i);
    }
  }
  
  if(!inputName && inputTag) {
    for(let i = 0; i < result; i++) {
      let showBool = tagShowContainer.indexOf(i);
      document.getElementsByClassName('container')[i].style.display = showBool != - 1 ? 'block' : 'none';
    }
    tagShowContainer = [], inputShowContainer = [];
  } else if(inputName && !inputTag) {
    for(let i = 0; i < result; i++) {
      let showBool = inputShowContainer.indexOf(i);
      document.getElementsByClassName('container')[i].style.display = showBool != - 1 ? 'block' : 'none';
    }
    tagShowContainer = [], inputShowContainer = [];
  } else if(inputName && inputTag) {
      for(let i = 0; i < result; i++) {
        let showBool = (inputShowContainer.indexOf(i) != -1) && (tagShowContainer.indexOf(i) != -1);
        document.getElementsByClassName('container')[i].style.display = showBool == true ? 'block' : 'none';
      }
      tagShowContainer = [], inputShowContainer = [];
    } else {
      for(let i = 0; i < result; i++) {
        document.getElementsByClassName('container')[i].style.display = 'block';
      }
    }
  }

function expand(element) {
  let index = element.id.charAt(10);
  for(let i = 0; i < score[index].length; i++) {
      $(`#table-${index}`).append(`<tr><td>Test ${i+1} </td><td>${score[index][i]}%</td></tr>`);
 } 

  document.getElementById(`table-${index}`).style.visibility = 'visible';
  document.getElementById(`appbutton-${index}`).style.visibility = 'hidden';
  document.getElementById(`disbutton-${index}`).style.visibility = 'visible';
  document.getElementById(`tag-${index}`).style.visibility = 'visible';
  document.getElementById(`tagvalue-${index}`).style.visibility = 'visible';

}

function hide(element) {
  let index = element.id.charAt(10);
  var id = document.getElementById(`table-${index}`);
  id.parentNode.removeChild(id);
  
  $(`#content-${index}`).after(`<table class='score' id='table-${index}'></table>`);
  document.getElementById(`appbutton-${index}`).style.visibility = 'visible';
  document.getElementById(`disbutton-${index}`).style.visibility = 'hidden';
  document.getElementById(`table-${index}`).style.visibility = 'hidden';
  document.getElementById(`tag-${index}`).style.visibility = 'hidden';
  document.getElementById(`tagvalue-${index}`).style.visibility = 'hidden';
}


function addTag(element) {
  let index = element.id;
  let i = index.charAt(4);
  this.input = document.getElementById(`${index}`).value;
  if(event.keyCode == 13) {
    event.preventDefault();
    $(`#tagvalue-${i}`).append(`<p class='col-xs-3'>${input}</p>`);
  }
}