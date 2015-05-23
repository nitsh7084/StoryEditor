define(['/scripts/ui.js','/scripts/Tag.js'],function(ui,Tag){



function Editor(el,item){
this.title_container = $('#story_title_cont a');
this.title_container_span = $("#story_title_cont a span");
this.body_container_span = $("#middle_story_body span");
this.description_container = $("#story_description_container");
this.body_container = $("#middle_story_body");
this.autosave_container = $('.autosave_container');
this.story_container = $('#story_main_container');
this.type = $("#story_main_container").attr('data-story-type');
this.make_it_live_button = $(".make_it_live_button");
this.add_tag_input = $(".create_add_tag");
this.tag_suggestion_item = $(".tag_suggestion_item");
this.story_tags_container = $(".story_tags_container");
this.story_tag = $('.story_tag');
this.add_new_item_icon = $('.add_new_item_icon');
this.add_new_list_item = $('.add_new_list li');
this.lightbox = $('.collegeink_create_lightbox');
this.add_new_sublist = $('.add_new_sublist');
this.add_new_sublist_item = $('.add_new_sublist li');
this.create_type = $("#story_main_container").attr('data-create-type');
this.item = this.create_type;
this.collegeink_dropdown_placeholder = $('.collegeink_dropdown_placeholder');
this.collegeink_dropdown_container = $('.collegeink_dropdown_container');
this.collegeink_dropdown_item = $('.collegeink_dropdown_container ul li');
this.save_container = $('.save_container');
this.tags_arr = new Array();
$window = $(window);
this.init();
}


Editor.prototype = {

init : function(){
var self = this;
var istitlekeypressed = false;
var isbodykeypressed = false;
var chars = this.title_container.text().length;

if(self.type == 'new'){
self.place_cursor("editable_field",0);
}else{
self.place_cursor("editable_field",chars);
}

this.action_type = this.story_container.attr('data-action-type');

ui.position_image($("#story_pic_container img"));

$('.tag_suggestion_item').bind('click',function(e){
console.log('called');

});

this.title_container.bind('click',function(e){
var self = this;
e.stopPropagation();
e.preventDefault();
//$(this).attr('contenteditable','true');
});

this.title_container.bind('copy paste cut keyup',function(e){
e.stopPropagation();
var text = self.title_container.text();
text = text.trim();
console.log(text);
self.count_chars();
if(self.type == 'new' || text == "Add title"){
if(istitlekeypressed !== true){
istitlekeypressed = true;
var num = e.keyCode;
var string1 = String.fromCharCode(num);
var string2 = string1.slice(1);
self.title_container.html(string2);
console.log(string2);
}
}
});

this.description_container.bind('click',function(){
$(this).html('');
$(this).attr('contenteditable','true');
});

this.body_container.bind('click',function(e){
var text = self.body_container.text();
text = text.trim();
if(text == "Type here to add body"){
self.place_cursor("body_container",0);
var num = e.keyCode;
var string1 = String.fromCharCode(num);
var string2 = string1.slice(1);
self.body_container.html(string2);
//$(this).attr('contenteditable','true');
}
});

this.body_container.bind('copy paste cut keyup',function(e){
var text = self.body_container.text();
text = text.trim();
e.stopPropagation();
self.count_chars();
if(self.type == 'new'){
if(isbodykeypressed !== true){
isbodykeypressed = true;
var num = e.keyCode;
var string1 = String.fromCharCode(num);
var string2 = string1.slice(1);
self.body_container.html(string2);
}
}
});


this.collegeink_dropdown_item.bind('click',function(e){
e.stopPropagation();
self.change_placeholder(this);
});


$("#story_title_cont a,#middle_story_body").bind('copy paste cut keyup',function(e){
e.stopPropagation();
console.log('keypressed');
if(typeof(typing) !== "undefined"){
clearTimeout(typing);
}
typing = setTimeout(function(){

if(self.action_type == 'create'){

if(self.item == 'story'){
self.save_story();
}else if(self.item == 'article'){
self.save_article();
}
else if(self.item == 'book'){
self.save_book();
}
}else if(self.action_type == 'edit'){
if(self.item == 'story'){
self.save_my_story();
}else if(self.item == 'article'){
self.save_my_article();
}
else if(self.item == 'book'){
self.save_my_book();
}
}
},2000);
});




this.make_it_live_button.bind('click',function(e){
e.stopPropagation();
var s_id = self.story_container.attr('data-story-id');
self.make_it_live(s_id);
});

this.add_tag_input.bind('keypress',function(){
var tag_name = $(".create_add_tag").val();
var tags_res = Tag.show_tags_to_add(tag_name);

tags_res.done(function(data){

var tags_data;

$.each(data.data,function(key,value){

tags_data += '<div class="tag_suggestion_item" onclick=""><div class="tag_suggestion_pic"><img src="http://collegeink.in/tags/'+value['pic_path']+'" /></div><div class="tag_suggestion_name">'+value['name']+'</div></div>';

});



tags_data = tags_data.replace("undefined","");

$(".tag_suggestion_container").html(tags_data);
$(".tag_suggestion_container").slideDown();

$('.tag_suggestion_item').bind('click',function(){
self.add_tag(this.innerText);
self.tags_arr.push(this.innerText);
if(self.action_type == 'edit'){
self.add_story_tag(this.innerText);
}
console.log(self.tags_arr);
});

});
});


this.collegeink_dropdown_placeholder.bind('click',function(e){
e.stopPropagation();
self.collegeink_dropdown_container.addClass('show_from_z');
});

this.story_tag.bind('click',function(e){
e.stopPropagation();
console.log('sdds');
$(this).css('display','none');
var index_num = self.tags_arr.indexOf(this.innerText);
console.log(index_num+'b'+this.innerText);
if(index_num != -1){
self.tags_arr.splice(index_num,1);
}
console.log(self.tags_arr);
if(self.action_type == 'edit'){
self.remove_story_tag(this.innerText);
}
});

$(".story_pic_change_input").bind('click',function(){
self.show_pic_change();
});

$window.bind('click',function(e){
e.stopPropagation();
$('.tag_suggestion_container').slideUp();
self.hide_menu();
self.collegeink_dropdown_container.removeClass('show_from_z');
});

this.add_new_item_icon.bind('click',function(e){
e.stopPropagation();
self.show_lightbox();
$('.add_new_list').addClass('show_add_list');
});

this.add_new_list_item.bind('click',function(e){
e.stopPropagation();
$('.add_new_list').addClass('move_to_z');
$('.add_new_sublist').addClass('show_from_right');
});

this.add_new_sublist_item.bind('click',function(e){
e.stopPropagation();
});




},

create_story : function(){
var self = this;

var request = $.ajax({
url:"/action/create.php",
type:"POST",
data:{action:'create_story'},
dataType:"json",
});


request.done(function(data){
console.log(data);
self.story_container.attr('data-story-id',data.id);
});

},

create_article : function(){
var request = $.ajax({
url:"/action/create.php",
type:"POST",
data:{action:'create_article'},
dataType:"json"
});

request.done(function(data){
console.log(data);
this.story_container.attr('data-story-id',data.id);
});

},

edit : function(){

},

save_story : function(){
var self = this;
var title = $("#story_title_cont a").html();
var body = $("#middle_story_body").html();
var tags_arr = new Array();
var privacy = $('.collegeink_dropdown_placeholder').html();
this.save_container.html('Saving');

title = title.replace("&nbsp;","");
body = body.replace("&nbsp;","");
title = title.trim();
body = body.trim();

console.log(body);
var story_id = this.story_container.attr('data-story-id');
var tags_arr1 = new Array();

if(self.tags_arr.length > 0){
tags_arr1 = self.tags_arr;
}
console.log(tags_arr1);

var request1 = $.ajax({
url:"/action/create.php",
type:"POST",
data:{action:'save_story',title:title,body:body,story_id:story_id,tags_arr1:tags_arr1,privacy:privacy},
dataType:"json"
});

request1.done(function(data){
var now = new Date();
var time_now = now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
self.autosave(time_now);
console.log(data);
self.save_container.html('Saved');
});


},

save_article : function(){
var self = this;

console.log(self.item);

var self = this;
var title = $("#story_title_cont a").html();
var body = $("#middle_story_body").html();
var tags_arr = new Array();
var privacy = $('.collegeink_dropdown_placeholder').html();
this.save_container.html('Saving');

title = title.replace("&nbsp;","");
body = body.replace("&nbsp;","");
title = title.trim();
body = body.trim();

console.log(body);
var story_id = this.story_container.attr('data-story-id');
var tags_arr1 = new Array();

if(self.tags_arr.length > 0){
tags_arr1 = self.tags_arr;
}
console.log(tags_arr1);

var request1 = $.ajax({
url:"/action/create.php",
type:"POST",
data:{action:'save_article',title:title,body:body,story_id:story_id,tags_arr1:tags_arr1,privacy:privacy},
dataType:"json"
});

request1.done(function(data){
var now = new Date();
var time_now = now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
self.autosave(time_now);
console.log(data);
self.save_container.html('Saved');
});



},

autosave : function(data){
console.log(data);
this.autosave_container.html('The story was saved at '+data);
},


make_it_live : function(story_id){
var self = this;

var tags_arr = new Array();

if(self.tags_arr.length > 0){
tags_arr = self.tags_arr;
}

if(self.action_type == 'create'){
if(self.item == 'story'){
var info_arr = new Array();
var make_it_live_req;
var get_info = $.ajax({
url:"/action/create.php",
type:"POST",
data:{action:'get_create_story',story_id:story_id,url:''},
dataType:"json"
});


get_info.done(function(data){
info_arr = data;
var mtitle = data.data[0]['title'];
var mdescription = data.data[0]['description'];
var mbody = data.data[0]['body'];
var mpic_path = '/home/collegei/public_html/create/'+data.data[0]['url']+'/'+data.data[0]['pic_path'];
var tags_arr = self.tags_arr;
var privacy = $('.collegeink_dropdown_placeholder').html();


make_it_live_req = $.ajax({
url:"/action/create.php",
type:"POST",
data:{action:'make_story_live',title:mtitle,description:mdescription,body:mbody,tags_arr:tags_arr,pic_path:mpic_path,privacy:privacy},
dataType:"json"
});

make_it_live_req.done(function(data){
console.log('make it live done');
console.log(data.story_url);
window.location.href = 'http://collegeink.in/story/'+data.story_url;
});


make_it_live_req.fail(function(xhr,status,error){
console.log(xhr+'b'+status+'b'+error);
//window.location.href = 'http://collegeink.in/story/'+data.story_url;
});


});
}

else if(self.item == 'article'){

console.log('article');

var info_arr = new Array();
var make_it_live_req;
var get_info = $.ajax({
url:"/action/create.php",
type:"POST",
data:{action:'get_create_article',story_id:story_id,url:''},
dataType:"json"
});


get_info.done(function(data){
info_arr = data;
var mtitle = data.data[0]['title'];
var mdescription = data.data[0]['description'];
var mbody = data.data[0]['body'];
var mpic_path = '/home/collegei/public_html/create/'+data.data[0]['url']+'/'+data.data[0]['pic_path'];
var tags_arr = self.tags_arr;
var privacy = $('.collegeink_dropdown_placeholder').html();


make_it_live_req = $.ajax({
url:"/action/create.php",
type:"POST",
data:{action:'make_article_live',title:mtitle,description:mdescription,body:mbody,tags_arr:tags_arr,pic_path:mpic_path,privacy:privacy},
dataType:"json"
});

make_it_live_req.done(function(data){
console.log('make it live done');
console.log(data.url);
window.location.href = 'http://collegeink.in/article/'+data.url;
});


make_it_live_req.fail(function(xhr,status,error){
console.log(xhr+'b'+status+'b'+error);
//window.location.href = 'http://collegeink.in/article/'+data.story_url;
});


});




}
else if(self.item == 'book'){

var info_arr = new Array();
var make_it_live_req;
var get_info = $.ajax({
url:"/action/create.php",
type:"POST",
data:{action:'get_create_book_chapter',story_id:story_id,url:''},
dataType:"json"
});


get_info.done(function(data){
info_arr = data;
var mtitle = data.data[0]['title'];
var mdescription = data.data[0]['description'];
var mbody = data.data[0]['body'];
var mpic_path = '/home/collegei/public_html/create/'+data.data[0]['url']+'/'+data.data[0]['pic_path'];
var tags_arr = self.tags_arr;
var privacy = $('.collegeink_dropdown_placeholder').html();


make_it_live_req = $.ajax({
url:"/action/create.php",
type:"POST",
data:{action:'make_story_live',title:mtitle,description:mdescription,body:mbody,tags_arr:tags_arr,pic_path:mpic_path,privacy:privacy},
dataType:"json"
});

make_it_live_req.done(function(data){
console.log('make it live done');
console.log(data.story_url);
window.location.href = 'http://collegeink.in/book/'+data.story_url;
});


make_it_live_req.fail(function(xhr,status,error){
console.log(xhr+'b'+status+'b'+error);
//window.location.href = 'http://collegeink.in/story/'+data.story_url;
});


});

}




}else{
var story_url = this.story_container.attr('data-story-url');
window.location.href = 'http://collegeink.in/story/'+story_url;
}


},


add_tag : function(name){
var self = this;
$('.story_tags_container').append('<div class="story_tag">'+name+'</div>');
$('.tag_suggestion_container').slideUp();
$('.create_add_tag').val('');



},


show_lightbox : function(){
console.log('csdc');
this.lightbox.css({
'opacity' : '1',
'pointer-events' : 'auto',
'z-index' : '300'
});
},

hide_menu : function(){
this.lightbox.css({
'opacity' : '0',
'pointer-events' : 'none',
'z-index' : '-5'
});
$('.add_new_list').removeClass('show_add_list');
this.add_new_sublist.removeClass('show_from_right');
},

add_story_tag : function(tag_id){
var story_id = this.story_container.attr('data-story-id');
var tag_request = $.ajax({
url:"/action/stories.php",
type:"POST",
data:{action:'add_story_tag',tag_id:tag_id,story_id:story_id},
dataType:"json"
});

tag_request.done(function(data){
console.log(data);
});
},

remove_story_tag : function(tag_id){
var story_id = this.story_container.attr('data-story-id');
var tag_request = $.ajax({
url:"/action/stories.php",
type:"POST",
data:{action:'remove_story_tag',tag_id:tag_id,story_id:story_id},
dataType:"json"
});

tag_request.done(function(data){
console.log(data);
});
},

save_my_story : function(){
var self = this;
var title = $("#story_title_cont a").html();
var body = $("#middle_story_body").html();
var tags_arr = new Array();
this.save_container.html('Saving');

title = title.replace("&nbsp;","");
body = body.replace("&nbsp;","");
title = title.trim();
body = body.trim();

var my_story_id = self.story_container.attr('data-story-id');
tags_arr = self.tags_arr;

console.log('called');

var story_req = $.ajax({
url:"/action/stories.php",
type:"POST",
data:{action:'edit_my_story',title:title,body:body,tags_arr:tags_arr,story_id:my_story_id},
dataType:"json",
});

story_req.done(function(data){
var now = new Date();
var time_now = now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
self.autosave(time_now);
console.log(data);
self.save_container.html('Saved');
});

},

save_my_article : function(){
var self = this;
self.save_container.html('Saving');
},


show_pic_change : function(){
$('.story_pic_change_submit').addClass('show_pic_change');
},


change_privacy : function(story_id){
var req = $.ajax({
url:"/action/privacy.php",
type:"POST",
data:{action:'change_privacy',story_id:story_id},
dataType:"json"
});

req.done(function(){

});

},

set_character_position : function(element){
var elem = document.querySelector(element);
if(elem.createTextRange){
var range = elem.createTextRange();
range.move('character',1);
range.select();
}else{
elem.focus();
elem.setSelectionRange(1,1);
}
},


change_placeholder : function(elem){
var self = this;
var text = elem.innerText;
elem.innerText = text;
$('.collegeink_dropdown_placeholder').html(text);
this.collegeink_dropdown_container.removeClass('show_from_z');
},


place_cursor : function(id,pos){
var el = document.querySelector("."+id);
var range = document.createRange();
var sel = window.getSelection();
range.setStart(el.childNodes[0], pos);
range.collapse(true);
sel.removeAllRanges();
sel.addRange(range);
},


count_chars : function(){
var text = this.title_container.text();
var chars = text.length;
console.log(chars);
if(chars >= 62){
var title = text.slice(0,62);
console.log(title);
this.title_container.text(title);
this.place_cursor("editable_field",62);
}
}

}

return Editor;


});