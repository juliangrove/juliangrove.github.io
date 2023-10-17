function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });
  
  slides.instructions1 = slide({
    name : "instructions1",
    start : function() {
    $('.bar').css('width', ( (100*(exp.phase)/exp.nQs) + "%"));    	
    	var inst1 = "";
//    	console.log(block_order);
    	if (exp.stims_block1[0].block == "ai") {
    		inst1 = inst1 + "First you'll answer questions about what the people at the party are asking about."
    	} else {
    		inst1 = inst1 + "First you'll answer questions about what the people at the party are certain about."    		
    		}
    	$("#inst1").html(inst1);
    },
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  }); 
     

  slides.block1 = slide({
    name : "block1",
    present : exp.stims_block1,
    start : function() {
      $(".err").hide();
    },
    present_handle : function(stim) {
    $('.bar').css('width', ( (100*(exp.phase)/exp.nQs) + "%"));    	    	    
      this.stim = stim;
    	this.stim.trial_start = Date.now();      
        $(".err").hide();    	
	  this.init_sliders();
      exp.sliderPost = null;	 
      console.log(this.stim);    
     //  if (this.stim.trigger_class == "control") {
//       	var utterance = "<strong>"+this.stim.fact+"."+this.stim.name + ":</strong> \"<i>"+this.stim.utterance+"</i>\"";
//       } else {
//       	var utterance = "<strong>"+this.stim.name+":</strong> \"<i>"+this.stim.fact+". "+ this.stim.utterance+"</i>\"";
//       }
      var utterance = "<strong> Fact (which "+this.stim.name+" knows that "+this.stim.name2+" knows):</strong> "+this.stim.fact+".";
      // var utterance = "<p>"+this.stim.name + ": \"<i>"+this.stim.utterance+"</i>\"</p>" +"<p>"+this.stim.name2 + ": \"<i>Are you sure?</i>\"</p>"+this.stim.name + ": \"<i>Yes, I'm sure that "+this.stim.question+".</i>\""
      //var sentence = "<strong>Fact (which"+this.stim.name+"knows):</strong> \"<i>"+this.stim.fact+"."</i>\"";
	var sentence = "<strong>"+this.stim.name+" asks:</strong> \"<i>"+this.stim.utterance.replace("[name]",this.stim.name2)+"</i>\"";
	  $(".sentence").html(sentence);
	  $(".utterance").html(utterance);
	  var question = "";
	  question = "How certain is "+this.stim.name+" that "+this.stim.name2+" believes "+this.stim.question+"?";
	  // console.log(this.stim.block);
// 	  if (this.stim.block == "ai") {
// 	  		question = "Is "+this.stim.name+" asking whether "+this.stim.question+"?";
// 	  } else {
// 	  		question = "Is "+this.stim.name+" certain that "+this.stim.question+"?";	  	
// 	  	}
	  $(".question").html(question);	  
    },

    button : function() {
    	console.log(exp.sliderPost);
      if (exp.sliderPost != null) {
        this.log_responses();
        _stream.apply(this); //use exp.go() if and only if there is no "present" data.
      } else {
        $(".err").show();
      }
    },
    init_sliders : function() {
      utils.make_slider("#single_slider", function(event, ui) {
        exp.sliderPost = ui.value;
      });
    },
    log_responses : function() {
      exp.data_trials.push({
      //"block" : "block1",
      //"question_type" : this.stim.block,      
   	  "slide_number_in_experiment" : exp.phase,
   	  "verb": this.stim.trigger,
   	  "contentNr": this.stim.content,
   	  "content": this.stim.question,
   	  "speakerGender": this.stim.gender,
   	  "fact": this.stim.fact,
   	  "fact_type": this.stim.fact_type,
   	  "utterance": this.stim.utterance,
      "question": this.stim.content,
   	  "subjectGender": this.stim.gender2,
   	  "speakerName": this.stim.name,
   	  "subjectName": this.stim.name2,
   	  "trigger_class": this.stim.trigger_class,   	  
      "response" : exp.sliderPost,
      "rt" : Date.now() - this.stim.trial_start
      });
    }
  }); 
  
  slides.questionaire =  slide({
    name : "questionaire",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
//        enjoyment : $("#enjoyment").val(),
        assess : $('input[name="assess"]:checked').val(),
		american : $('input[name="american"]:checked').val(),
		gender : $('input[name="gender"]:checked').val(),
		//american : $("#american").val(),
        //american : $('input[name="american"]:checked').val(),
        age : $("#age").val(),
        //gender : $("#gender").val(),
//        education : $("#education").val(),
          comments : $("#comments").val(),
	  singleHit : $('input[name="checkbox"]:checked').val(),
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.finished = slide({
    name : "finished",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {

var speaker_names = _.shuffle([
    {
      "name":"James",
      "gender":"M"
    },
//    {
//      "name":"John",
//      "gender":"M"
//    },
    {
      "name":"Robert",
      "gender":"M"
    },
//     {
//       "name":"Michael",
//       "gender":"M"
//     },
    {
      "name":"William",
      "gender":"M"
    },
    {
      "name":"David",
      "gender":"M"
    },
   {
     "name":"Richard",
     "gender":"M"
   },
 //    {
//       "name":"Joseph",
//       "gender":"M"
//     },
//     {
//       "name":"Charles",
//       "gender":"M"
//     },
    {
      "name":"Thomas",
      "gender":"M"
    },
    {
      "name":"Christopher",
      "gender":"M"
    },
 //    {
//       "name":"Daniel",
//       "gender":"M"
//     },
    {
      "name":"Matthew",
      "gender":"M"
    },
//    {
//      "name":"Donald",
//      "gender":"M"
//    },
//     {
//       "name":"Anthony",
//       "gender":"M"
//     },
    {
      "name":"Paul",
      "gender":"M"
    },
   {
     "name":"Mark",
     "gender":"M"
   },
    {
      "name":"George",
      "gender":"M"
    },
    {
      "name":"Steven",
      "gender":"M"
    },
    {
      "name":"Kenneth",
      "gender":"M"
    },
    {
      "name":"Jennifer",
      "gender":"F"
    },
    {
      "name":"Elizabeth",
      "gender":"F"
    },
    {
      "name":"Linda",
      "gender":"F"
    },
//     {
//       "name":"Emily",
//       "gender":"F"
//     },
   {
     "name":"Susan",
     "gender":"F"
   },
    {
      "name":"Margaret",
      "gender":"F"
    },
    {
      "name":"Jessica",
      "gender":"F"
    },
    {
      "name":"Dorothy",
      "gender":"F"
    },
    {
      "name":"Sarah",
      "gender":"F"
    },
    {
      "name":"Karen",
      "gender":"F"
    },
    {
      "name":"Nancy",
      "gender":"F"
    },
    {
      "name":"Betty",
      "gender":"F"
    },
    {
      "name":"Lisa",
      "gender":"F"
    },
    {
      "name":"Sandra",
      "gender":"F"
    },
    {
      "name":"Helen",
      "gender":"F"
    },
    {
      "name":"Ashley",
      "gender":"F"
    },
    {
      "name":"Donna",
      "gender":"F"
    },
    {
      "name":"Kimberly",
      "gender":"F"
    },
    {
      "name":"Carol",
      "gender":"F"
    },
    {
      "name":"Michelle",
      "gender":"F"
    }]);


var female_subject_names = _.shuffle([
//       {
//         "name":"Emily",
//         "gender":"F"
//       },
//    {
//      "name":"Mary",
//      "gender":"F"
//    },
    {
      "name":"Stephanie",
      "gender":"F"
    },
    {
      "name":"Melissa",
      "gender":"F"
    },
//     {
//       "name":"Deborah",
//       "gender":"F"
//     },
    {
      "name":"Laura",
      "gender":"F"
    },
    {
      "name":"Stephanie",
      "gender":"F"
    },
    {
      "name":"Rebecca",
      "gender":"F"
    },
    {
      "name":"Sharon",
      "gender":"F"
    },
    {
      "name":"Rebecca",
      "gender":"F"
    },
    {
      "name":"Kathleen",
      "gender":"F"
    },
    {
      "name":"Ruth",
      "gender":"F"
    },
   {
     "name":"Anna",
     "gender":"F"
   },
    {
      "name":"Shirley",
      "gender":"F"
    },
    {
      "name":"Amy",
      "gender":"F"
    },
    {
      "name":"Angela",
      "gender":"F"
    },
    {
      "name":"Laura",
      "gender":"F"
    },
    {
      "name":"Sharon",
      "gender":"F"
    },
    {
      "name":"Catherine",
      "gender":"F"
    },
    {
      "name":"Nicole",
      "gender":"F"
    },
    {
      "name":"Christina",
      "gender":"F"
    },
    {
      "name":"Amanda",
      "gender":"F"
    },
 //    {
//       "name":"Samantha",
//       "gender":"F"
//     },
    {
      "name":"Carolyn",
      "gender":"F"
    },
    {
      "name":"Rachel",
      "gender":"F"
    },
    {
      "name":"Heather",
      "gender":"F"
    },
    {
      "name":"Kathleen",
      "gender":"F"
    },
    {
      "name":"Ruth",
      "gender":"F"
    },
    {
      "name":"Julie",
      "gender":"F"
    }
//     {
//       "name":"Emma",
//       "gender":"F"
//     }   
]);

var male_subject_names = _.shuffle([
   {
     "name":"Kevin",
     "gender":"M"
   },
    {
      "name":"Scott",
      "gender":"M"
    },
 //    {
//       "name":"Joshua",
//       "gender":"M"
//     },
    {
      "name":"Brian",
      "gender":"M"
    },
    {
      "name":"Kevin",
      "gender":"M"
    },
    {
      "name":"Brian",
      "gender":"M"
    },
    {
      "name":"Timothy",
      "gender":"M"
    },
 //    {
//       "name":"Jason",
//       "gender":"M"
//     },
    {
      "name":"Tim",
      "gender":"M"
    },
    {
      "name":"Gary",
      "gender":"M"
    },
    {
      "name":"Ryan",
      "gender":"M"
    },
    {
      "name":"Nicholas",
      "gender":"M"
    },
    {
      "name":"Eric",
      "gender":"M"
    },
    {
      "name":"Jacob",
      "gender":"M"
    },
  //   {
//       "name":"Jonathan",
//       "gender":"M"
//     },
    {
      "name":"Larry",
      "gender":"M"
    },
//    {
//      "name":"Frank",
//      "gender":"M"
//    },
    {
      "name":"Ray",
      "gender":"M"
    },
    {
      "name":"Justin",
      "gender":"M"
    },
    {
      "name":"Jerry",
      "gender":"M"
    },
    {
      "name":"Raymond",
      "gender":"M"
    },
    {
      "name":"Ben",
      "gender":"M"
    },
 //    {
//       "name":"Samuel",
//       "gender":"M"
//     },
    {
      "name":"Ray",
      "gender":"M"
    },
    {
      "name":"Patrick",
      "gender":"M"
    },
//    {
//      "name":"Jack",
//      "gender":"M"
//    },
//     {
//       "name":"Dennis",
//       "gender":"M"
//     },
    {
      "name":"Jerry",
      "gender":"M"
    },
    {
      "name":"Alexander",
      "gender":"M"
    },
    {
      "name":"Tyler",
      "gender":"M"
    }
    ]);


var items = _.shuffle([ 
   {
     "trigger":"annoyed",
     "trigger_class":"NonProj"
   }, 
   {
     "trigger":"know",
     "trigger_class":"NonProj"
   },
   {
     "trigger":"discover",
     "trigger_class":"NonProj"
   }, 
   {
     "trigger":"reveal",
     "trigger_class":"NonProj"
   },
   {
     "trigger":"see",
     "trigger_class":"NonProj"
   },
   {
     "trigger":"establish",
     "trigger_class":"NonProj"
   },
   {
     "trigger":"pretend",
     "trigger_class":"NonProj"
   },
   {
     "trigger":"think",
     "trigger_class":"NonProj"
   },
   {
     "trigger":"suggest",
     "trigger_class":"C"
   }, 
   {
     "trigger":"prove",
     "trigger_class":"C"
   }, 
   {
     "trigger":"demonstrate",
     "trigger_class":"C"
   }, 
   {
     "trigger":"say",
     "trigger_class":"C"
   },
   {
     "trigger":"hear",
     "trigger_class":"C"
   },
   {
     "trigger":"confess",
     "trigger_class":"C"
   }, 
   {
     "trigger":"inform_Sam",
     "trigger_class":"C"
   }, 
   {
     "trigger":"announce",
     "trigger_class":"C"
   }, 
   {
     "trigger":"acknowledge",
     "trigger_class":"C"
   },
   {
     "trigger":"admit",
     "trigger_class":"C"
   },
   {
     "trigger":"confirm",
     "trigger_class":"C"
   },
   {
     "trigger":"be_right_that",
     "trigger_class":"C"
   }
 ]);

 var contents = {
 "1": {
  "gender":"f",
  "content":"Mary is pregnant",
  "annoyed":"Is [name] annoyed that Mary is pregnant?",
  "know":"Does [name] know that Mary is pregnant?",
  "discover":"Did [name] discover that Mary is pregnant?",
  "reveal":"Did [name] reveal that Mary is pregnant?",
  "see" :"Did [name] see that Mary is pregnant?",
  "establish":"Did [name] establish that Mary is pregnant?",
  "pretend":"Did [name] pretend that Mary is pregnant?",
  "think":"Does [name] think that Mary is pregnant?",
  "suggest":"Did [name] suggest that Mary is pregnant?",
  "prove":"Did [name] prove that Mary is pregnant?",
  "demonstrate":"Did [name] demonstrate that Mary is pregnant?",
  "say":"Did [name] say that Mary is pregnant?",
  "hear":"Did [name] hear that Mary is pregnant?",
  "confess":"Did [name] confess that Mary is pregnant?",
  "inform_Sam":"Did [name] inform Sam that Mary is pregnant?",
  "announce":"Did [name] announce that Mary is pregnant?",
  "acknowledge":"Did [name] acknowledge that Mary is pregnant?",
  "admit":"Did [name] admit that Mary is pregnant?",
  "confirm":"Did [name] confirm that Mary is pregnant?",
  "be_right_that":"Is [name] right that Mary is pregnant?"
  },
  "2": {
  "gender":"f",
  "content":"Josie went on vacation to France",
  "annoyed":"Is [name] annoyed that Josie went on vacation to France?",
  "know":"Does [name] know that Josie went on vacation to France?",
  "discover":"Did [name] discover that Josie went on vacation to France?",
  "reveal":"Did [name] reveal that Josie went on vacation to France?",
  "see" :"Did [name] see that Josie went on vacation to France?",
  "establish":"Did [name] establish that Josie went on vacation to France?",
  "pretend":"Did [name] pretend that Josie went on vacation to France?",
  "think":"Does [name] think that Josie went on vacation to France?",
  "suggest":"Did [name] suggest that Josie went on vacation to France?",
  "prove":"Did [name] prove that Josie went on vacation to France?",
  "demonstrate":"Did [name] demonstrate that Josie went on vacation to France?",
  "say":"Did [name] say that Josie went on vacation to France?",
  "hear":"Did [name] hear that Josie went on vacation to France?",
  "confess":"Did [name] confess that Josie went on vacation to France?",
  "inform_Sam":"Did [name] inform Sam that Josie went on vacation to France?",
  "announce":"Did [name] announce that Josie went on vacation to France?",
  "acknowledge":"Did [name] acknowledge that Josie went on vacation to France?",
  "admit":"Did [name] admit that Josie went on vacation to France?",
  "confirm":"Did [name] confirm that Josie went on vacation to France?",
  "be_right_that":"Is [name] right that Josie went on vacation to France?"
  },
  "3": {
  "gender":"f",
  "content":"Emma studied on Saturday morning",
  "annoyed":"Is [name] annoyed that Emma studied on Saturday morning?",
  "know":"Does [name] know that Emma studied on Saturday morning?",
  "discover":"Did [name] discover that Emma studied on Saturday morning?",
  "reveal":"Did [name] reveal that Emma studied on Saturday morning?",
  "see" :"Did [name] see that Emma studied on Saturday morning?",
  "establish":"Did [name] establish that Emma studied on Saturday morning?",
  "pretend":"Did [name] pretend that Emma studied on Saturday morning?",
  "think":"Does [name] think that Emma studied on Saturday morning?",
  "suggest":"Did [name] suggest that Emma studied on Saturday morning?",
  "prove":"Did [name] prove that Emma studied on Saturday morning?",
  "demonstrate":"Did [name] demonstrate that Emma studied on Saturday morning?",
  "say":"Did [name] say that Emma studied on Saturday morning?",
  "hear":"Did [name] hear that Emma studied on Saturday morning?",
  "confess":"Did [name] confess that Emma studied on Saturday morning?",
  "inform_Sam":"Did [name] inform Sam that Emma studied on Saturday morning?",
  "announce":"Did [name] announce that Emma studied on Saturday morning?",
  "acknowledge":"Did [name] acknowledge that Emma studied on Saturday morning?",
  "admit":"Did [name] admit that Emma studied on Saturday morning?",
  "confirm":"Did [name] confirm that Emma studied on Saturday morning?",
  "be_right_that":"Is [name] right that Emma studied on Saturday morning?"
  },
  "4": {
  "gender":"f",
  "content":"Olivia sleeps until noon",
  "annoyed":"Is [name] annoyed that Olivia sleeps until noon?",
  "know":"Does [name] know that Olivia sleeps until noon?",
  "discover":"Did [name] discover that Olivia sleeps until noon?",
  "reveal":"Did [name] reveal that Olivia sleeps until noon?",
  "see" :"Did [name] see that Olivia sleeps until noon?",
  "establish":"Did [name] establish that Olivia sleeps until noon?",
  "pretend":"Did [name] pretend that Olivia sleeps until noon?",
  "think":"Does [name] think that Olivia sleeps until noon?",
  "suggest":"Did [name] suggest that Olivia sleeps until noon?",
  "prove":"Did [name] prove that Olivia sleeps until noon?",
  "demonstrate":"Did [name] demonstrate that Olivia sleeps until noon?",
  "say":"Did [name] say that Olivia sleeps until noon?",
  "hear":"Did [name] hear that Olivia sleeps until noon?",
  "confess":"Did [name] confess that Olivia sleeps until noon?",
  "inform_Sam":"Did [name] inform Sam that Olivia sleeps until noon?",
  "announce":"Did [name] announce that Olivia sleeps until noon?",
  "acknowledge":"Did [name] acknowledge that Olivia sleeps until noon?",
  "admit":"Did [name] admit that Olivia sleeps until noon?",
  "confirm":"Did [name] confirm that Olivia sleeps until noon?",
  "be_right_that":"Is [name] right that Olivia sleeps until noon?"
  },
  "5": {
  "gender":"f",
  "content":"Sophia got a tattoo",
  "annoyed":"Is [name] annoyed that Sophia got a tattoo?",
  "know":"Does [name] know that Sophia got a tattoo?",
  "discover":"Did [name] discover that Sophia got a tattoo?",
  "reveal":"Did [name] reveal that Sophia got a tattoo?",
  "see" :"Did [name] see that Sophia got a tattoo?",
  "establish":"Did [name] establish that Sophia got a tattoo?",
  "pretend":"Did [name] pretend that Sophia got a tattoo?",
  "think":"Does [name] think that Sophia got a tattoo?",
  "suggest":"Did [name] suggest that Sophia got a tattoo?",
  "prove":"Did [name] prove that Sophia got a tattoo?",
  "demonstrate":"Did [name] demonstrate that Sophia got a tattoo?",
  "say":"Did [name] say that Sophia got a tattoo?",
  "hear":"Did [name] hear that Sophia got a tattoo?",
  "confess":"Did [name] confess that Sophia got a tattoo?",
  "inform_Sam":"Did [name] inform Sam that Sophia got a tattoo?",
  "announce":"Did [name] announce that Sophia got a tattoo?",
  "acknowledge":"Did [name] acknowledge that Sophia got a tattoo?",
  "admit":"Did [name] admit that Sophia got a tattoo?",
  "confirm":"Did [name] confirm that Sophia got a tattoo?",
  "be_right_that":"Is [name] right that Sophia got a tattoo?"
  },
  "6": {
  "gender":"f",
  "content":"Mia drank 2 cocktails last night",
  "annoyed":"Is [name] annoyed that Mia drank 2 cocktails last night?",
  "know":"Does [name] know that Mia drank 2 cocktails last night?",
  "discover":"Did [name] discover that Mia drank 2 cocktails last night?",
  "reveal":"Did [name] reveal that Mia drank 2 cocktails last night?",
  "see" :"Did [name] see that Mia drank 2 cocktails last night?",
  "establish":"Did [name] establish that Mia drank 2 cocktails last night?",
  "pretend":"Did [name] pretend that Mia drank 2 cocktails last night?",
  "think":"Does [name] think that Mia drank 2 cocktails last night?",
  "suggest":"Did [name] suggest that Mia drank 2 cocktails last night?",
  "prove":"Did [name] prove that Mia drank 2 cocktails last night?",
  "demonstrate":"Did [name] demonstrate that Mia drank 2 cocktails last night?",
  "say":"Did [name] say that Mia drank 2 cocktails last night?",
  "hear":"Did [name] hear that Mia drank 2 cocktails last night?",
  "confess":"Did [name] confess that Mia drank 2 cocktails last night?",
  "inform_Sam":"Did [name] inform Sam that Mia drank 2 cocktails last night?",
  "announce":"Did [name] announce that Mia drank 2 cocktails last night?",
  "acknowledge":"Did [name] acknowledge that Mia drank 2 cocktails last night?",
  "admit":"Did [name] admit that Mia drank 2 cocktails last night?",
  "confirm":"Did [name] confirm that Mia drank 2 cocktails last night?",
  "be_right_that":"Is [name] right that Mia drank 2 cocktails last night?"
  },
  "7": {
  "gender":"f",
  "content":"Isabella ate a steak on Sunday",
  "annoyed":"Is [name] annoyed that Isabella ate a steak on Sunday?",
  "know":"Does [name] know that Isabella ate a steak on Sunday?",
  "discover":"Did [name] discover that Isabella ate a steak on Sunday?",
  "reveal":"Did [name] reveal that Isabella ate a steak on Sunday?",
  "see" :"Did [name] see that Isabella ate a steak on Sunday?",
  "establish":"Did [name] establish that Isabella ate a steak on Sunday?",
  "pretend":"Did [name] pretend that Isabella ate a steak on Sunday?",
  "think":"Does [name] think that Isabella ate a steak on Sunday?",
  "suggest":"Did [name] suggest that Isabella ate a steak on Sunday?",
  "prove":"Did [name] prove that Isabella ate a steak on Sunday?",
  "demonstrate":"Did [name] demonstrate that Isabella ate a steak on Sunday?",
  "say":"Did [name] say that Isabella ate a steak on Sunday?",
  "hear":"Did [name] hear that Isabella ate a steak on Sunday?",
  "confess":"Did [name] confess that Isabella ate a steak on Sunday?",
  "inform_Sam":"Did [name] inform Sam that Isabella ate a steak on Sunday?",
  "announce":"Did [name] announce that Isabella ate a steak on Sunday?",
  "acknowledge":"Did [name] acknowledge that Isabella ate a steak on Sunday?",
  "admit":"Did [name] admit that Isabella ate a steak on Sunday?",
  "confirm":"Did [name] confirm that Isabella ate a steak on Sunday?",
  "be_right_that":"Is [name] right that Isabella ate a steak on Sunday?"
  },
  "8": {
  "gender":"f",
  "content":"Emily bought a car yesterday",
  "annoyed":"Is [name] annoyed that Emily bought a car yesterday?",
  "know":"Does [name] know that Emily bought a car yesterday?",
  "discover":"Did [name] discover that Emily bought a car yesterday?",
  "reveal":"Did [name] reveal that Emily bought a car yesterday?",
  "see" :"Did [name] see that Emily bought a car yesterday?",
  "establish":"Did [name] establish that Emily bought a car yesterday?",
  "pretend":"Did [name] pretend that Emily bought a car yesterday?",
  "think":"Does [name] think that Emily bought a car yesterday?",
  "suggest":"Did [name] suggest that Emily bought a car yesterday?",
  "prove":"Did [name] prove that Emily bought a car yesterday?",
  "demonstrate":"Did [name] demonstrate that Emily bought a car yesterday?",
  "say":"Did [name] say that Emily bought a car yesterday?",
  "hear":"Did [name] hear that Emily bought a car yesterday?",
  "confess":"Did [name] confess that Emily bought a car yesterday?",
  "inform_Sam":"Did [name] inform Sam that Emily bought a car yesterday?",
  "announce":"Did [name] announce that Emily bought a car yesterday?",
  "acknowledge":"Did [name] acknowledge that Emily bought a car yesterday?",
  "admit":"Did [name] admit that Emily bought a car yesterday?",
  "confirm":"Did [name] confirm that Emily bought a car yesterday?",
  "be_right_that":"Is [name] right that Emily bought a car yesterday?"
  },
  "9": {
  "gender":"f",
  "content":"Grace visited her sister",
  "annoyed":"Is [name] annoyed that Grace visited her sister?",
  "know":"Does [name] know that Grace visited her sister?",
  "discover":"Did [name] discover that Grace visited her sister?",
  "reveal":"Did [name] reveal that Grace visited her sister?",
  "see" :"Did [name] see that Grace visited her sister?",
  "establish":"Did [name] establish that Grace visited her sister?",
  "pretend":"Did [name] pretend that Grace visited her sister?",
  "think":"Does [name] think that Grace visited her sister?",
  "suggest":"Did [name] suggest that Grace visited her sister?",
  "prove":"Did [name] prove that Grace visited her sister?",
  "demonstrate":"Did [name] demonstrate that Grace visited her sister?",
  "say":"Did [name] say that Grace visited her sister?",
  "hear":"Did [name] hear that Grace visited her sister?",
  "confess":"Did [name] confess that Grace visited her sister?",
  "inform_Sam":"Did [name] inform Sam that Grace visited her sister?",
  "announce":"Did [name] announce that Grace visited her sister?",
  "acknowledge":"Did [name] acknowledge that Grace visited her sister?",
  "admit":"Did [name] admit that Grace visited her sister?",
  "confirm":"Did [name] confirm that Grace visited her sister?",
  "be_right_that":"Is [name] right that Grace visited her sister?"
  },
  "10": {
  "gender":"f",
  "content":"Zoe calculated the tip",
  "annoyed":"Is [name] annoyed that Zoe calculated the tip?",
  "know":"Does [name] know that Zoe calculated the tip?",
  "discover":"Did [name] discover that Zoe calculated the tip?",
  "reveal":"Did [name] reveal that Zoe calculated the tip?",
  "see" :"Did [name] see that Zoe calculated the tip?",
  "establish":"Did [name] establish that Zoe calculated the tip?",
  "pretend":"Did [name] pretend that Zoe calculated the tip?",
  "think":"Does [name] think that Zoe calculated the tip?",
  "suggest":"Did [name] suggest that Zoe calculated the tip?",
  "prove":"Did [name] prove that Zoe calculated the tip?",
  "demonstrate":"Did [name] demonstrate that Zoe calculated the tip?",
  "say":"Did [name] say that Zoe calculated the tip?",
  "hear":"Did [name] hear that Zoe calculated the tip?",
  "confess":"Did [name] confess that Zoe calculated the tip?",
  "inform_Sam":"Did [name] inform Sam that Zoe calculated the tip?",
  "announce":"Did [name] announce that Zoe calculated the tip?",
  "acknowledge":"Did [name] acknowledge that Zoe calculated the tip?",
  "admit":"Did [name] admit that Zoe calculated the tip?",
  "confirm":"Did [name] confirm that Zoe calculated the tip?",
  "be_right_that":"Is [name] right that Zoe calculated the tip?"
  },
  "11": {
  "gender":"m",
  "content":"Danny ate the last cupcake",
  "annoyed":"Is [name] annoyed that Danny ate the last cupcake?",
  "know":"Does [name] know that Danny ate the last cupcake?",
  "discover":"Did [name] discover that Danny ate the last cupcake?",
  "reveal":"Did [name] reveal that Danny ate the last cupcake?",
  "see" :"Did [name] see that Danny ate the last cupcake?",
  "establish":"Did [name] establish that Danny ate the last cupcake?",
  "pretend":"Did [name] pretend that Danny ate the last cupcake?",
  "think":"Does [name] think that Danny ate the last cupcake?",
  "suggest":"Did [name] suggest that Danny ate the last cupcake?",
  "prove":"Did [name] prove that Danny ate the last cupcake?",
  "demonstrate":"Did [name] demonstrate that Danny ate the last cupcake?",
  "say":"Did [name] say that Danny ate the last cupcake?",
  "hear":"Did [name] hear that Danny ate the last cupcake?",
  "confess":"Did [name] confess that Danny ate the last cupcake?",
  "inform_Sam":"Did [name] inform Sam that Danny ate the last cupcake?",
  "announce":"Did [name] announce that Danny ate the last cupcake?",
  "acknowledge":"Did [name] acknowledge that Danny ate the last cupcake?",
  "admit":"Did [name] admit that Danny ate the last cupcake?",
  "confirm":"Did [name] confirm that Danny ate the last cupcake?",
  "be_right_that":"Is [name] right that Danny ate the last cupcake?"
  },
  "12": {
  "gender":"m",
  "content":"Frank got a cat",
  "annoyed":"Is [name] annoyed that Frank got a cat?",
  "know":"Does [name] know that Frank got a cat?",
  "discover":"Did [name] discover that Frank got a cat?",
  "reveal":"Did [name] reveal that Frank got a cat?",
  "see" :"Did [name] see that Frank got a cat?",
  "establish":"Did [name] establish that Frank got a cat?",
  "pretend":"Did [name] pretend that Frank got a cat?",
  "think":"Does [name] think that Frank got a cat?",
  "suggest":"Did [name] suggest that Frank got a cat?",
  "prove":"Did [name] prove that Frank got a cat?",
  "demonstrate":"Did [name] demonstrate that Frank got a cat?",
  "say":"Did [name] say that Frank got a cat?",
  "hear":"Did [name] hear that Frank got a cat?",
  "confess":"Did [name] confess that Frank got a cat?",
  "inform_Sam":"Did [name] inform Sam that Frank got a cat?",
  "announce":"Did [name] announce that Frank got a cat?",
  "acknowledge":"Did [name] acknowledge that Frank got a cat?",
  "admit":"Did [name] admit that Frank got a cat?",
  "confirm":"Did [name] confirm that Frank got a cat?",
  "be_right_that":"Is [name] right that Frank got a cat?"
  },
  "13": {
  "gender":"m",
  "content":"Jackson ran 10 miles",
  "annoyed":"Is [name] annoyed that Jackson ran 10 miles?",
  "know":"Does [name] know that Jackson ran 10 miles?",
  "discover":"Did [name] discover that Jackson ran 10 miles?",
  "reveal":"Did [name] reveal that Jackson ran 10 miles?",
  "see" :"Did [name] see that Jackson ran 10 miles?",
  "establish":"Did [name] establish that Jackson ran 10 miles?",
  "pretend":"Did [name] pretend that Jackson ran 10 miles?",
  "think":"Does [name] think that Jackson ran 10 miles?",
  "suggest":"Did [name] suggest that Jackson ran 10 miles?",
  "prove":"Did [name] prove that Jackson ran 10 miles?",
  "demonstrate":"Did [name] demonstrate that Jackson ran 10 miles?",
  "say":"Did [name] say that Jackson ran 10 miles?",
  "hear":"Did [name] hear that Jackson ran 10 miles?",
  "confess":"Did [name] confess that Jackson ran 10 miles?",
  "inform_Sam":"Did [name] inform Sam that Jackson ran 10 miles?",
  "announce":"Did [name] announce that Jackson ran 10 miles?",
  "acknowledge":"Did [name] acknowledge that Jackson ran 10 miles?",
  "admit":"Did [name] admit that Jackson ran 10 miles?",
  "confirm":"Did [name] confirm that Jackson ran 10 miles?",
  "be_right_that":"Is [name] right that Jackson ran 10 miles?"
  },
  "14": {
  "gender":"m",
  "content":"Jayden rented a car",
  "annoyed":"Is [name] annoyed that Jayden rented a car?",
  "know":"Does [name] know that Jayden rented a car?",
  "discover":"Did [name] discover that Jayden rented a car?",
  "reveal":"Did [name] reveal that Jayden rented a car?",
  "see" :"Did [name] see that Jayden rented a car?",
  "establish":"Did [name] establish that Jayden rented a car?",
  "pretend":"Did [name] pretend that Jayden rented a car?",
  "think":"Does [name] think that Jayden rented a car?",
  "suggest":"Did [name] suggest that Jayden rented a car?",
  "prove":"Did [name] prove that Jayden rented a car?",
  "demonstrate":"Did [name] demonstrate that Jayden rented a car?",
  "say":"Did [name] say that Jayden rented a car?",
  "hear":"Did [name] hear that Jayden rented a car?",
  "confess":"Did [name] confess that Jayden rented a car?",
  "inform_Sam":"Did [name] inform Sam that Jayden rented a car?",
  "announce":"Did [name] announce that Jayden rented a car?",
  "acknowledge":"Did [name] acknowledge that Jayden rented a car?",
  "admit":"Did [name] admit that Jayden rented a car?",
  "confirm":"Did [name] confirm that Jayden rented a car?",
  "be_right_that":"Is [name] right that Jayden rented a car?"
  },
  "15": {
  "gender":"m",
  "content":"Tony had a drink last night",
  "annoyed":"Is [name] annoyed that Tony had a drink last night?",
  "know":"Does [name] know that Tony had a drink last night?",
  "discover":"Did [name] discover that Tony had a drink last night?",
  "reveal":"Did [name] reveal that Tony had a drink last night?",
  "see" :"Did [name] see that Tony had a drink last night?",
  "establish":"Did [name] establish that Tony had a drink last night?",
  "pretend":"Did [name] pretend that Tony had a drink last night?",
  "think":"Does [name] think that Tony had a drink last night?",
  "suggest":"Did [name] suggest that Tony had a drink last night?",
  "prove":"Did [name] prove that Tony had a drink last night?",
  "demonstrate":"Did [name] demonstrate that Tony had a drink last night?",
  "say":"Did [name] say that Tony had a drink last night?",
  "hear":"Did [name] hear that Tony had a drink last night?",
  "confess":"Did [name] confess that Tony had a drink last night?",
  "inform_Sam":"Did [name] inform Sam that Tony had a drink last night?",
  "announce":"Did [name] announce that Tony had a drink last night?",
  "acknowledge":"Did [name] acknowledge that Tony had a drink last night?",
  "admit":"Did [name] admit that Tony had a drink last night?",
  "confirm":"Did [name] confirm that Tony had a drink last night?",
  "be_right_that":"Is [name] right that Tony had a drink last night?"
  },
  "16": {
  "gender":"m",
  "content":"Josh learned to ride a bike yesterday",
  "annoyed":"Is [name] annoyed that Josh learned to ride a bike yesterday?",
  "know":"Does [name] know that Josh learned to ride a bike yesterday?",
  "discover":"Did [name] discover that Josh learned to ride a bike yesterday?",
  "reveal":"Did [name] reveal that Josh learned to ride a bike yesterday?",
  "see" :"Did [name] see that Josh learned to ride a bike yesterday?",
  "establish":"Did [name] establish that Josh learned to ride a bike yesterday?",
  "pretend":"Did [name] pretend that Josh learned to ride a bike yesterday?",
  "think":"Does [name] think that Josh learned to ride a bike yesterday?",
  "suggest":"Did [name] suggest that Josh learned to ride a bike yesterday?",
  "prove":"Did [name] prove that Josh learned to ride a bike yesterday?",
  "demonstrate":"Did [name] demonstrate that Josh learned to ride a bike yesterday?",
  "say":"Did [name] say that Josh learned to ride a bike yesterday?",
  "hear":"Did [name] hear that Josh learned to ride a bike yesterday?",
  "confess":"Did [name] confess that Josh learned to ride a bike yesterday?",
  "inform_Sam":"Did [name] inform Sam that Josh learned to ride a bike yesterday?",
  "announce":"Did [name] announce that Josh learned to ride a bike yesterday?",
  "acknowledge":"Did [name] acknowledge that Josh learned to ride a bike yesterday?",
  "admit":"Did [name] admit that Josh learned to ride a bike yesterday?",
  "confirm":"Did [name] confirm that Josh learned to ride a bike yesterday?",
  "be_right_that":"Is [name] right that Josh learned to ride a bike yesterday?"
  },
  "17": {
  "gender":"m",
  "content":"Owen shoveled snow last winter",
  "annoyed":"Is [name] annoyed that Owen shoveled snow last winter?",
  "know":"Does [name] know that Owen shoveled snow last winter?",
  "discover":"Did [name] discover that Owen shoveled snow last winter?",
  "reveal":"Did [name] reveal that Owen shoveled snow last winter?",
  "see" :"Did [name] see that Owen shoveled snow last winter?",
  "establish":"Did [name] establish that Owen shoveled snow last winter?",
  "pretend":"Did [name] pretend that Owen shoveled snow last winter?",
  "think":"Does [name] think that Owen shoveled snow last winter?",
  "suggest":"Did [name] suggest that Owen shoveled snow last winter?",
  "prove":"Did [name] prove that Owen shoveled snow last winter?",
  "demonstrate":"Did [name] demonstrate that Owen shoveled snow last winter?",
  "say":"Did [name] say that Owen shoveled snow last winter?",
  "hear":"Did [name] hear that Owen shoveled snow last winter?",
  "confess":"Did [name] confess that Owen shoveled snow last winter?",
  "inform_Sam":"Did [name] inform Sam that Owen shoveled snow last winter?",
  "announce":"Did [name] announce that Owen shoveled snow last winter?",
  "acknowledge":"Did [name] acknowledge that Owen shoveled snow last winter?",
  "admit":"Did [name] admit that Owen shoveled snow last winter?",
  "confirm":"Did [name] confirm that Owen shoveled snow last winter?",
  "be_right_that":"Is [name] right that Owen shoveled snow last winter?"
  },
  "18": {
  "gender":"m",
  "content":"Julian dances salsa",
  "annoyed":"Is [name] annoyed that Julian dances salsa?",
  "know":"Does [name] know that Julian dances salsa?",
  "discover":"Did [name] discover that Julian dances salsa?",
  "reveal":"Did [name] reveal that Julian dances salsa?",
  "see" :"Did [name] see that Julian dances salsa?",
  "establish":"Did [name] establish that Julian dances salsa?",
  "pretend":"Did [name] pretend that Julian dances salsa?",
  "think":"Does [name] think that Julian dances salsa?",
  "suggest":"Did [name] suggest that Julian dances salsa?",
  "prove":"Did [name] prove that Julian dances salsa?",
  "demonstrate":"Did [name] demonstrate that Julian dances salsa?",
  "say":"Did [name] say that Julian dances salsa?",
  "hear":"Did [name] hear that Julian dances salsa?",
  "confess":"Did [name] confess that Julian dances salsa?",
  "inform_Sam":"Did [name] inform Sam that Julian dances salsa?",
  "announce":"Did [name] announce that Julian dances salsa?",
  "acknowledge":"Did [name] acknowledge that Julian dances salsa?",
  "admit":"Did [name] admit that Julian dances salsa?",
  "confirm":"Did [name] confirm that Julian dances salsa?",
  "be_right_that":"Is [name] right that Julian dances salsa?"
  },
  "19": {
  "gender":"m",
  "content":"Jon walks to work",
  "annoyed":"Is [name] annoyed that Jon walks to work?",
  "know":"Does [name] know that Jon walks to work?",
  "discover":"Did [name] discover that Jon walks to work?",
  "reveal":"Did [name] reveal that Jon walks to work?",
  "see" :"Did [name] see that Jon walks to work?",
  "establish":"Did [name] establish that Jon walks to work?",
  "pretend":"Did [name] pretend that Jon walks to work?",
  "think":"Does [name] think that Jon walks to work?",
  "suggest":"Did [name] suggest that Jon walks to work?",
  "prove":"Did [name] prove that Jon walks to work?",
  "demonstrate":"Did [name] demonstrate that Jon walks to work?",
  "say":"Did [name] say that Jon walks to work?",
  "hear":"Did [name] hear that Jon walks to work?",
  "confess":"Did [name] confess that Jon walks to work?",
  "inform_Sam":"Did [name] inform Sam that Jon walks to work?",
  "announce":"Did [name] announce that Jon walks to work?",
  "acknowledge":"Did [name] acknowledge that Jon walks to work?",
  "admit":"Did [name] admit that Jon walks to work?",
  "confirm":"Did [name] confirm that Jon walks to work?",
  "be_right_that":"Is [name] right that Jon walks to work?"
  },
  "20": {
  "gender":"m",
  "content":"Charley speaks Spanish",
  "annoyed":"Is [name] annoyed that Charley speaks Spanish?",
  "know":"Does [name] know that Charley speaks Spanish?",
  "discover":"Did [name] discover that Charley speaks Spanish?",
  "reveal":"Did [name] reveal that Charley speaks Spanish?",
  "see" :"Did [name] see that Charley speaks Spanish?",
  "establish":"Did [name] establish that Charley speaks Spanish?",
  "pretend":"Did [name] pretend that Charley speaks Spanish?",
  "think":"Does [name] think that Charley speaks Spanish?",
  "suggest":"Did [name] suggest that Charley speaks Spanish?",
  "prove":"Did [name] prove that Charley speaks Spanish?",
  "demonstrate":"Did [name] demonstrate that Charley speaks Spanish?",
  "say":"Did [name] say that Charley speaks Spanish?",
  "hear":"Did [name] hear that Charley speaks Spanish?",
  "confess":"Did [name] confess that Charley speaks Spanish?",
  "inform_Sam":"Did [name] inform Sam that Charley speaks Spanish?",
  "announce":"Did [name] announce that Charley speaks Spanish?",
  "acknowledge":"Did [name] acknowledge that Charley speaks Spanish?",
  "admit":"Did [name] admit that Charley speaks Spanish?",
  "confirm":"Did [name] confirm that Charley speaks Spanish?",
  "be_right_that":"Is [name] right that Charley speaks Spanish?"
  }
};

var facts = {
 "1": {
  "factH":"Mary is taking a prenatal yoga class",
  "factL":"Mary is a middle school student"
  },
  "2": {
  "factH":"Josie loves France",
  "factL":"Josie doesn't have a passport"
  },
  "3": {
  "factH":"Emma is in law school",
  "factL":"Emma is in first grade"
  },
  "4": {
  "factH":"Olivia works the third shift",
  "factL":"Olivia has two small children"
  },
  "5": {
  "factH":"Sophia is a hipster",
  "factL":"Sophia is a high end fashion model"
  },
  "6": {
  "factH":"Mia is a college student",
  "factL":"Mia is a nun"
  },
  "7": {
  "factH":"Isabella is from Argentina",
  "factL":"Isabella is a vegetarian"
  },
  "8": {
  "factH":"Emily has been saving for a year",
  "factL":"Emily never has any money"
  },
  "9": {
  "factH":"Grace loves her sister",
  "factL":"Grace hates her sister"
  },
  "10": {
  "factH":"Zoe is a math major",
  "factL":"Zoe is 5 years old"
  },
  "11": {
  "factH":"Danny loves cake",
  "factL":"Danny is a diabetic"
  },
  "12": {
  "factH":"Frank has always wanted a pet",
  "factL":"Frank is allergic to cats"
  },
  "13": {
  "factH":"Jackson is training for a marathon",
  "factL":"Jackson is obese"
  },
  "14": {
  "factH":"Jayden's car is in the shop",
  "factL":"Jayden doesn't have a driver's license"
  },
  "15": {
  "factH":"Tony really likes to party with his friends",
  "factL":"Tony has been sober for 20 years"
  },
  "16": {
  "factH":"Josh is a 5-year old boy",
  "factL":"Josh is a 75-year old man"
  },
  "17": {
  "factH":"Owen lives in Chicago",
  "factL":"Owen lives in New Orleans"
  },
  "18": {
  "factH":"Julian is Cuban",
  "factL":"Julian is German"
  },
  "19": {
  "factH":"Jon lives 2 blocks away from work",
  "factL":"Jon lives 10 miles away from work"
  },
  "20": {
  "factH":"Charley lives in Mexico",
  "factL":"Charley lives in Korea"
  }
};
  
var items_content_mapping = {
"annoyed":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
"know":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
"discover":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
"reveal":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
"see":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
"establish":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
"pretend":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],  
"think":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
"suggest":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
"prove":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
"demonstrate":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
"say":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],	 "hear":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
"confess":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],	 "inform_Sam":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
"announce":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],	 "acknowledge":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
"admit":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],	 "confirm":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
"be_right_that":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"]
};  

var content_fact_mapping = {
"1":["factH","factL"],
"2":["factH","factL"],
"3":["factH","factL"],
"4":["factH","factL"],
"5":["factH","factL"],
"6":["factH","factL"],
"7":["factH","factL"],
"8":["factH","factL"],
"9":["factH","factL"],
"10":["factH","factL"],
"11":["factH","factL"],
"12":["factH","factL"],
"13":["factH","factL"],
"14":["factH","factL"],
"15":["factH","factL"],
"16":["factH","factL"],
"17":["factH","factL"],
"18":["factH","factL"],
"19":["factH","factL"],
"20":["factH","factL"]
}; 
 

// get trigger contents
  function getContent(trigger) {
//  		console.log("items_content_mapping before throwing out "+trigger);
//  		console.log(items_content_mapping);
//  		for (var j in items_content_mapping) {  	
//  		console.log("items_content_mapping at "+j);  			
//  		console.log(items_content_mapping[j]);  		
//  		}  		
//  		console.log("items_content_mapping at the trigger before shuffling");
//  		console.log(items_content_mapping[trigger]);  		
  		items_content_mapping[trigger] = _.shuffle(items_content_mapping[trigger]);
//  		console.log("items_content_mapping at the trigger after shuffling");
//  		console.log(items_content_mapping[trigger]);  		  		
//  		console.log("items_content_mapping after shuffling "+trigger);
//  		console.log(items_content_mapping);
  		var content = items_content_mapping[trigger].shift();//items_content_mapping[trigger][0];
//  		console.log("this is the selected content: " + content);
//		var index = items_content_mapping[trigger].indexOf(content);  		
//  		items_content_mapping[trigger] = items_content_mapping[trigger].splice(index,1);
//  		console.log("items_content_mapping at the trigger after throwing it out");
//  		console.log(items_content_mapping[trigger]);  		  		
  		for (var j in items_content_mapping) {
			var index = items_content_mapping[j].indexOf(content);  
//			console.log("the next three lines: the array before removal, the index of content, the array after removal")
//			console.log(items_content_mapping[j]);
//			console.log(index);		
			if (index != -1)
			{			  			
				items_content_mapping[j].splice(index,1);			
			}
//			console.log(items_content_mapping[j]);			
  		}
//  		console.log("items_content_mapping after throwing out "+trigger);
//  		console.log(items_content_mapping);
//  		for (var j in items_content_mapping) {  	
//  		console.log("items_content_mapping at "+j);  			
//  		console.log(items_content_mapping[j]);  		
//  		}   		  		
  		return content;
  	}
  	
// get content facts
  function getFact(content) {
//  		console.log("items_content_mapping before throwing out "+trigger);
//  		console.log(items_content_mapping);
//  		for (var j in items_content_mapping) {  	
//  		console.log("items_content_mapping at "+j);  			
//  		console.log(items_content_mapping[j]);  		
//  		}  		
//  		console.log("items_content_mapping at the trigger before shuffling");
//  		console.log(items_content_mapping[trigger]);  		
  		content_fact_mapping[content] = _.shuffle(content_fact_mapping[content]);
//  		console.log("items_content_mapping at the trigger after shuffling");
//  		console.log(items_content_mapping[trigger]);  		  		
//  		console.log("items_content_mapping after shuffling "+trigger);
//  		console.log(items_content_mapping);
  		var factType = content_fact_mapping[content].shift();//items_content_mapping[trigger][0];
//  		console.log("this is the selected content: " + content);
//		var index = items_content_mapping[trigger].indexOf(content);  		
//  		items_content_mapping[trigger] = items_content_mapping[trigger].splice(index,1);
//  		console.log("items_content_mapping at the trigger after throwing it out");
//  		console.log(items_content_mapping[trigger]);  		  		
//  		for (var j in items_content_mapping) {
//			var index = items_content_mapping[j].indexOf(content);  
//			console.log("the next three lines: the array before removal, the index of content, the array after removal")
//			console.log(items_content_mapping[j]);
//			console.log(index);		
//			if (index != -1)
//			{			  			
//				items_content_mapping[j].splice(index,1);			
//			}
//			console.log(items_content_mapping[j]);			
//  		}
//  		console.log("items_content_mapping after throwing out "+trigger);
//  		console.log(items_content_mapping);
//  		for (var j in items_content_mapping) {  	
//  		console.log("items_content_mapping at "+j);  			
//  		console.log(items_content_mapping[j]);  		
//  		}   		  		
  		return factType;
  	}

// assign contents to triggers
  var trigger_contents = {
  	"annoyed": getContent("annoyed"),  	  	
  	"know": getContent("know"),
  	"discover": getContent("discover"),  	  	
  	"reveal": getContent("reveal"),
  	"see": getContent("see"),
  	"establish": getContent("establish"),
  	"pretend": getContent("pretend"),  	
  	"think": getContent("think"),  	
  	"suggest": getContent("suggest"),
  	"prove": getContent("prove"),
  	"demonstrate": getContent("demonstrate"),
  	"say": getContent("say"),
  	"hear": getContent("hear"),
  	"confess": getContent("confess"),  	
  	"inform_Sam": getContent("inform_Sam"),
  	"announce": getContent("announce"),
  	"acknowledge": getContent("acknowledge"),
  	"admit": getContent("admit"),
  	"confirm": getContent("confirm"),
  	"be_right_that": getContent("be_right_that")
  	};
  	
// assign facts to contents
  var content_facts = {
  	"1": getFact("1"),
  	"2": getFact("2"),
  	"3": getFact("3"),
  	"4": getFact("4"),
  	"5": getFact("5"),
  	"6": getFact("6"),
  	"7": getFact("7"),
  	"8": getFact("8"),
  	"9": getFact("9"),
  	"10": getFact("10"),
  	"11": getFact("11"),
  	"12": getFact("12"),
  	"13": getFact("13"),
  	"14": getFact("14"),
  	"15": getFact("15"),
  	"16": getFact("16"),
  	"17": getFact("17"),
  	"18": getFact("18"),
  	"19": getFact("19"),
  	"20": getFact("20")
  	};

    control_items = [
	{
	    "item_id" : "control1",
	    "short_trigger" : "control",
	    "utterance" : "Are Zack and Fred coming to the meeting tomorrow?",
	    "content" : "Zack is coming to the meeting tomorrow",
	    "fact" : "Zack is a member of the golf club",
	    "name2" : "Fred"
	},
	{
	    "item_id" : "control2",
	    "short_trigger" : "control",
	    "utterance" : "Is Mary and Jessica's aunt sick?",
	    "content" : "Mary's aunt is sick",
	    "fact" : "Mary visited her aunt on Sunday",
	    "name2" : "Jessica"
	},
	{
	    "item_id" : "control3",
	    "short_trigger" : "control",
	    "utterance" : "Did Todd and Austin play football in high school?",
	    "content" : "Todd played football in high school",
	    "fact" : "Todd goes to the gym 3 times a week",
	    "name2" : "Austin"
	},
	{
	    "item_id" : "control4",
	    "short_trigger" : "control",
	    "utterance" : "Is either Vanessa or Claire good at math?",
	    "content" : "Vanessa is good at math",
	    "fact" : "Vanessa won a prize at school",
	    "name2" : "Claire"
	},
	{
	    "item_id" : "control5",
	    "short_trigger" : "control",
	    "utterance" : "Did Madison or Sylvia have a baby?",
	    "content" : "Madison had a baby",
	    "fact" : "Trish sent Madison a card",
	    "name2" : "Sylvia"
	},
	{
	    "item_id" : "control6",
	    "short_trigger" : "control",
	    "utterance" : "Was either Hendrick's or William's car expensive?",
	    "content" : "Hendrick's car was expensive",
	    "fact" : "Hendrick just bought a car",
	    "name2" : "William"
	}
    ];
    
  function makeControlStim(i) {
      //get item
      var item = control_items[i];
      //get a name to be speaker
      var name_data = speaker_names[i];
      var name = name_data.name;
      var gender = name_data.gender;
      
      return {
	  "name": name,
	  "name2": item.name2,
	  "gender": gender,	
	  "gender2": "NA",  
	  "trigger": item.short_trigger,
	  "short_trigger": item.short_trigger,	  
	  "trigger_class": "control",
	  "content": item.item_id,
	  "fact": item.fact,
	  "fact_type": "NA",
	  "utterance": item.utterance,
	  "question": item.content
      }
  }

  function makeStim(i, factType) {
    //get item
    var item = items[i];
	//get a name to be speaker
    var name_data = speaker_names[i];
    var name = name_data.name;
    var gender = name_data.gender;
    
    // get content
    var trigger_cont = trigger_contents[item.trigger];
    var trigger = item.trigger;
    var short_trigger = trigger;
    
    // get fact for that content
    // var	factType = content_facts[trigger_cont];
    	
console.log(trigger_cont+" "+factType);

//   console.log("short_trigger: "+short_trigger);
//	console.log("trigger: "+trigger);
//	console.log(trigger_cont);
//  console.log("trigger_cont: "+trigger_cont);
//   console.log("utterance: "+contents[trigger_cont][short_trigger]);    
//   console.log(contents[trigger_cont]);   
//    console.log(trigger_cont); 
    //var fact = facts[trigger_cont][fact];
    var utterance = contents[trigger_cont][short_trigger];
    var question = contents[trigger_cont].content; 
    var fact = facts[trigger_cont][factType];
    var factType = factType;
    console.log(fact)
//   console.log(contents[trigger_cont]);
//    console.log(question) 
    //get another name to be subject
    var name_data2 = contents[trigger_cont].gender == "m" ? female_subject_names[i] : male_subject_names[i];
    var name2 = name_data2.name;
    var gender2 = name_data2.gender;
    return {
	  "name": name,
	  "name2": name2,
	  "gender": gender,	
	  "gender2": gender2,  
	  "trigger": item.trigger,
	  "short_trigger": short_trigger,	  
	  "trigger_class": item.trigger_class,
	  "fact": fact,
	  "fact_type": factType,
      "content": trigger_cont,
      "utterance": utterance,
      "question": question
    }
  }
  exp.stims_block1 = [];
//   exp.stims_block2 = []; 
  for (var i=0; i<items.length; i++) {
  	var stim = i < items.length/2 ? makeStim(i,"factL") : makeStim(i, "factH");
//    exp.stims_block1.push(makeStim(i));
	exp.stims_block1.push(jQuery.extend(true, {}, stim));
//	exp.stims_block2.push(jQuery.extend(true, {}, stim));	
  }  

  for (var j=0; j<control_items.length; j++) {
  	var stim = makeControlStim(j);
//    exp.stims_block1.push(makeStim(i));
	exp.stims_block1.push(jQuery.extend(true, {}, stim));
//	exp.stims_block2.push(jQuery.extend(true, {}, stim));	
  }    
  
console.log(exp.stims_block1);
//console.log(exp.stims_block2);   

	exp.stims_block1 = _.shuffle(exp.stims_block1);  
//	exp.stims_block2 = _.shuffle(exp.stims_block2); 
	
// decide which block comes first
//   var block_order = _.shuffle(["ai","projective"]);
//   var block1type = block_order[0];
//   var block2type = block_order[1];  
//   console.log(block_order);
//   console.log(block1type);  
//   console.log(block2type);    
// 
//    for (k in exp.stims_block2) {
//    		exp.stims_block2[k].block = block2type;//block_order[1];   	
//    	}
//    	
//    for (i in exp.stims_block1) {
//    		exp.stims_block1[i].block = block1type;//block_order[0];   	
//    	}


console.log(exp.stims_block1);
//console.log(exp.stims_block2);   	

//  exp.all_stims = [];
//  for (var i=0; i<items.length; i++) {
//    exp.all_stims.push(makeStim(i));
//  }
//
//	for (k in exp.all_stims) {
//		console.log(exp.all_stims[k].content)
//		}

  exp.trials = [];
  exp.catch_trials = [];
  exp.condition = {}; //can randomize between subject conditions here
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "block1", 'questionaire', 'finished'];
  
  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

 exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined
                    
   // exp.nQs = 2 + 20 + 1; 
  $(".nQs").html(exp.nQs);

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}
