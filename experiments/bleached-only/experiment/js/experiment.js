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
	var utterance = "You walk into the kitchen and overhear " + this.stim.name + " ask somebody else a question. " + this.stim.name + " doesn't know you and wants to be secretive, so speaks in somewhat coded language.";
      // var utterance = "<p>"+this.stim.name + ": \"<i>"+this.stim.utterance+"</i>\"</p>" +"<p>"+this.stim.name2 + ": \"<i>Are you sure?</i>\"</p>"+this.stim.name + ": \"<i>Yes, I'm sure that "+this.stim.question+".</i>\""
      //var sentence = "<strong>Fact (which"+this.stim.name+"knows):</strong> \"<i>"+this.stim.fact+"."</i>\"";
      var sentence = "<strong>"+this.stim.name+" asks:</strong> \"<i>"+ this.stim.utterance+"</i>\"";
	  $(".sentence").html(sentence);
	  $(".utterance").html(utterance);
	  var question = "";
	  question = "Is "+this.stim.name+" certain that "+this.stim.question+"?";
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
      "name":"Amanda",
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
      "name":"Cynthia",
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
      "name":"Virginia",
      "gender":"F"
    },
    {
      "name":"Brenda",
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
      "name":"Janet",
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
      "name":"Diane",
      "gender":"F"
    },
    {
      "name":"Joyce",
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
     "name":"Andrew",
     "gender":"M"
   },
    {
      "name":"Edward",
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
      "name":"Ronald",
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
      "name":"Jeffrey",
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
      "name":"Scott",
      "gender":"M"
    },
    {
      "name":"Justin",
      "gender":"M"
    },
    {
      "name":"Brandon",
      "gender":"M"
    },
    {
      "name":"Raymond",
      "gender":"M"
    },
    {
      "name":"Gregory",
      "gender":"M"
    },
 //    {
//       "name":"Samuel",
//       "gender":"M"
//     },
    {
      "name":"Benjamin",
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
  "content":"that thing happened",
  "annoyed":"Is Patrick annoyed that a particular thing happened?",
  "know":"Does Patrick know that a particular thing happened?",
  "discover":"Did Patrick discover that a particular thing happened?",
  "reveal":"Did Patrick reveal that a particular thing happened?",
  "see" :"Did Patrick see that a particular thing happened?",
  "establish":"Did Patrick establish that a particular thing happened?",
  "pretend":"Did Patrick pretend that a particular thing happened?",
  "think":"Does Patrick think that a particular thing happened?",
  "suggest":"Did Patrick suggest that a particular thing happened?",
  "prove":"Did Patrick prove that a particular thing happened?",
  "demonstrate":"Did Patrick demonstrate that a particular thing happened?",
  "say":"Did Patrick say that a particular thing happened?",
  "hear":"Did Patrick hear that a particular thing happened?",
  "confess":"Did Patrick confess that a particular thing happened?",
  "inform_Sam":"Did Patrick inform Sam that a particular thing happened?",
  "announce":"Did Patrick announce that a particular thing happened?",
  "acknowledge":"Did Patrick acknowledge that a particular thing happened?",
  "admit":"Did Patrick admit that a particular thing happened?",
  "confirm":"Did Patrick confirm that a particular thing happened?",
  "be_right_that":"Is Patrick right that a particular thing happened?"
  },
  "2": {
  "gender":"f",
  "content":"that thing happened",
  "annoyed":"Is Scott annoyed that a particular thing happened?",
  "know":"Does Scott know that a particular thing happened?",
  "discover":"Did Scott discover that a particular thing happened?",
  "reveal":"Did Scott reveal that a particular thing happened?",
  "see" :"Did Scott see that a particular thing happened?",
  "establish":"Did Scott establish that a particular thing happened?",
  "pretend":"Did Scott pretend that a particular thing happened?",
  "think":"Does Scott think that a particular thing happened?",
  "suggest":"Did Scott suggest that a particular thing happened?",
  "prove":"Did Scott prove that a particular thing happened?",
  "demonstrate":"Did Scott demonstrate that a particular thing happened?",
  "say":"Did Scott say that a particular thing happened?",
  "hear":"Did Scott hear that a particular thing happened?",
  "confess":"Did Scott confess that a particular thing happened?",
  "inform_Sam":"Did Scott inform Sam that a particular thing happened?",
  "announce":"Did Scott announce that a particular thing happened?",
  "acknowledge":"Did Scott acknowledge that a particular thing happened?",
  "admit":"Did Scott admit that a particular thing happened?",
  "confirm":"Did Scott confirm that a particular thing happened?",
  "be_right_that":"Is Scott right that a particular thing happened?"
  },
  "3": {
  "gender":"f",
  "content":"that thing happened",
  "annoyed":"Is Justin annoyed that a particular thing happened?",
  "know":"Does Justin know that a particular thing happened?",
  "discover":"Did Justin discover that a particular thing happened?",
  "reveal":"Did Justin reveal that a particular thing happened?",
  "see" :"Did Justin see that a particular thing happened?",
  "establish":"Did Justin establish that a particular thing happened?",
  "pretend":"Did Justin pretend that a particular thing happened?",
  "think":"Does Justin think that a particular thing happened?",
  "suggest":"Did Justin suggest that a particular thing happened?",
  "prove":"Did Justin prove that a particular thing happened?",
  "demonstrate":"Did Justin demonstrate that a particular thing happened?",
  "say":"Did Justin say that a particular thing happened?",
  "hear":"Did Justin hear that a particular thing happened?",
  "confess":"Did Justin confess that a particular thing happened?",
  "inform_Sam":"Did Justin inform Sam that a particular thing happened?",
  "announce":"Did Justin announce that a particular thing happened?",
  "acknowledge":"Did Justin acknowledge that a particular thing happened?",
  "admit":"Did Justin admit that a particular thing happened?",
  "confirm":"Did Justin confirm that a particular thing happened?",
  "be_right_that":"Is Justin right that a particular thing happened?"
  },
  "4": {
  "gender":"f",
  "content":"that thing happened",
  "annoyed":"Is Jerry annoyed that a particular thing happened?",
  "know":"Does Jerry know that a particular thing happened?",
  "discover":"Did Jerry discover that a particular thing happened?",
  "reveal":"Did Jerry reveal that a particular thing happened?",
  "see" :"Did Jerry see that a particular thing happened?",
  "establish":"Did Jerry establish that a particular thing happened?",
  "pretend":"Did Jerry pretend that a particular thing happened?",
  "think":"Does Jerry think that a particular thing happened?",
  "suggest":"Did Jerry suggest that a particular thing happened?",
  "prove":"Did Jerry prove that a particular thing happened?",
  "demonstrate":"Did Jerry demonstrate that a particular thing happened?",
  "say":"Did Jerry say that a particular thing happened?",
  "hear":"Did Jerry hear that a particular thing happened?",
  "confess":"Did Jerry confess that a particular thing happened?",
  "inform_Sam":"Did Jerry inform Sam that a particular thing happened?",
  "announce":"Did Jerry announce that a particular thing happened?",
  "acknowledge":"Did Jerry acknowledge that a particular thing happened?",
  "admit":"Did Jerry admit that a particular thing happened?",
  "confirm":"Did Jerry confirm that a particular thing happened?",
  "be_right_that":"Is Jerry right that a particular thing happened?"
  },
  "5": {
  "gender":"f",
  "content":"that thing happened",
  "annoyed":"Is Ben annoyed that a particular thing happened?",
  "know":"Does Ben know that a particular thing happened?",
  "discover":"Did Ben discover that a particular thing happened?",
  "reveal":"Did Ben reveal that a particular thing happened?",
  "see" :"Did Ben see that a particular thing happened?",
  "establish":"Did Ben establish that a particular thing happened?",
  "pretend":"Did Ben pretend that a particular thing happened?",
  "think":"Does Ben think that a particular thing happened?",
  "suggest":"Did Ben suggest that a particular thing happened?",
  "prove":"Did Ben prove that a particular thing happened?",
  "demonstrate":"Did Ben demonstrate that a particular thing happened?",
  "say":"Did Ben say that a particular thing happened?",
  "hear":"Did Ben hear that a particular thing happened?",
  "confess":"Did Ben confess that a particular thing happened?",
  "inform_Sam":"Did Ben inform Sam that a particular thing happened?",
  "announce":"Did Ben announce that a particular thing happened?",
  "acknowledge":"Did Ben acknowledge that a particular thing happened?",
  "admit":"Did Ben admit that a particular thing happened?",
  "confirm":"Did Ben confirm that a particular thing happened?",
  "be_right_that":"Is Ben right that a particular thing happened?"
  },
  "6": {
  "gender":"f",
  "content":"that thing happened",
  "annoyed":"Is Ray annoyed that a particular thing happened?",
  "know":"Does Ray know that a particular thing happened?",
  "discover":"Did Ray discover that a particular thing happened?",
  "reveal":"Did Ray reveal that a particular thing happened?",
  "see" :"Did Ray see that a particular thing happened?",
  "establish":"Did Ray establish that a particular thing happened?",
  "pretend":"Did Ray pretend that a particular thing happened?",
  "think":"Does Ray think that a particular thing happened?",
  "suggest":"Did Ray suggest that a particular thing happened?",
  "prove":"Did Ray prove that a particular thing happened?",
  "demonstrate":"Did Ray demonstrate that a particular thing happened?",
  "say":"Did Ray say that a particular thing happened?",
  "hear":"Did Ray hear that a particular thing happened?",
  "confess":"Did Ray confess that a particular thing happened?",
  "inform_Sam":"Did Ray inform Sam that a particular thing happened?",
  "announce":"Did Ray announce that a particular thing happened?",
  "acknowledge":"Did Ray acknowledge that a particular thing happened?",
  "admit":"Did Ray admit that a particular thing happened?",
  "confirm":"Did Ray confirm that a particular thing happened?",
  "be_right_that":"Is Ray right that a particular thing happened?"
  },
  "7": {
  "gender":"f",
  "content":"that thing happened",
  "annoyed":"Is Kevin annoyed that a particular thing happened?",
  "know":"Does Kevin know that a particular thing happened?",
  "discover":"Did Kevin discover that a particular thing happened?",
  "reveal":"Did Kevin reveal that a particular thing happened?",
  "see" :"Did Kevin see that a particular thing happened?",
  "establish":"Did Kevin establish that a particular thing happened?",
  "pretend":"Did Kevin pretend that a particular thing happened?",
  "think":"Does Kevin think that a particular thing happened?",
  "suggest":"Did Kevin suggest that a particular thing happened?",
  "prove":"Did Kevin prove that a particular thing happened?",
  "demonstrate":"Did Kevin demonstrate that a particular thing happened?",
  "say":"Did Kevin say that a particular thing happened?",
  "hear":"Did Kevin hear that a particular thing happened?",
  "confess":"Did Kevin confess that a particular thing happened?",
  "inform_Sam":"Did Kevin inform Sam that a particular thing happened?",
  "announce":"Did Kevin announce that a particular thing happened?",
  "acknowledge":"Did Kevin acknowledge that a particular thing happened?",
  "admit":"Did Kevin admit that a particular thing happened?",
  "confirm":"Did Kevin confirm that a particular thing happened?",
  "be_right_that":"Is Kevin right that a particular thing happened?"
  },
  "8": {
  "gender":"f",
  "content":"that thing happened",
  "annoyed":"Is Brian annoyed that a particular thing happened?",
  "know":"Does Brian know that a particular thing happened?",
  "discover":"Did Brian discover that a particular thing happened?",
  "reveal":"Did Brian reveal that a particular thing happened?",
  "see" :"Did Brian see that a particular thing happened?",
  "establish":"Did Brian establish that a particular thing happened?",
  "pretend":"Did Brian pretend that a particular thing happened?",
  "think":"Does Brian think that a particular thing happened?",
  "suggest":"Did Brian suggest that a particular thing happened?",
  "prove":"Did Brian prove that a particular thing happened?",
  "demonstrate":"Did Brian demonstrate that a particular thing happened?",
  "say":"Did Brian say that a particular thing happened?",
  "hear":"Did Brian hear that a particular thing happened?",
  "confess":"Did Brian confess that a particular thing happened?",
  "inform_Sam":"Did Brian inform Sam that a particular thing happened?",
  "announce":"Did Brian announce that a particular thing happened?",
  "acknowledge":"Did Brian acknowledge that a particular thing happened?",
  "admit":"Did Brian admit that a particular thing happened?",
  "confirm":"Did Brian confirm that a particular thing happened?",
  "be_right_that":"Is Brian right that a particular thing happened?"
  },
  "9": {
  "gender":"f",
  "content":"that thing happened",
  "annoyed":"Is Andrew annoyed that a particular thing happened?",
  "know":"Does Andrew know that a particular thing happened?",
  "discover":"Did Andrew discover that a particular thing happened?",
  "reveal":"Did Andrew reveal that a particular thing happened?",
  "see" :"Did Andrew see that a particular thing happened?",
  "establish":"Did Andrew establish that a particular thing happened?",
  "pretend":"Did Andrew pretend that a particular thing happened?",
  "think":"Does Andrew think that a particular thing happened?",
  "suggest":"Did Andrew suggest that a particular thing happened?",
  "prove":"Did Andrew prove that a particular thing happened?",
  "demonstrate":"Did Andrew demonstrate that a particular thing happened?",
  "say":"Did Andrew say that a particular thing happened?",
  "hear":"Did Andrew hear that a particular thing happened?",
  "confess":"Did Andrew confess that a particular thing happened?",
  "inform_Sam":"Did Andrew inform Sam that a particular thing happened?",
  "announce":"Did Andrew announce that a particular thing happened?",
  "acknowledge":"Did Andrew acknowledge that a particular thing happened?",
  "admit":"Did Andrew admit that a particular thing happened?",
  "confirm":"Did Andrew confirm that a particular thing happened?",
  "be_right_that":"Is Andrew right that a particular thing happened?"
  },
  "10": {
  "gender":"f",
  "content":"that thing happened",
  "annoyed":"Is Tim annoyed that a particular thing happened?",
  "know":"Does Tim know that a particular thing happened?",
  "discover":"Did Tim discover that a particular thing happened?",
  "reveal":"Did Tim reveal that a particular thing happened?",
  "see" :"Did Tim see that a particular thing happened?",
  "establish":"Did Tim establish that a particular thing happened?",
  "pretend":"Did Tim pretend that a particular thing happened?",
  "think":"Does Tim think that a particular thing happened?",
  "suggest":"Did Tim suggest that a particular thing happened?",
  "prove":"Did Tim prove that a particular thing happened?",
  "demonstrate":"Did Tim demonstrate that a particular thing happened?",
  "say":"Did Tim say that a particular thing happened?",
  "hear":"Did Tim hear that a particular thing happened?",
  "confess":"Did Tim confess that a particular thing happened?",
  "inform_Sam":"Did Tim inform Sam that a particular thing happened?",
  "announce":"Did Tim announce that a particular thing happened?",
  "acknowledge":"Did Tim acknowledge that a particular thing happened?",
  "admit":"Did Tim admit that a particular thing happened?",
  "confirm":"Did Tim confirm that a particular thing happened?",
  "be_right_that":"Is Tim right that a particular thing happened?"
  },
  "11": {
  "gender":"m",
  "content":"that thing happened",
  "annoyed":"Is Amanda annoyed that a particular thing happened?",
  "know":"Does Amanda know that a particular thing happened?",
  "discover":"Did Amanda discover that a particular thing happened?",
  "reveal":"Did Amanda reveal that a particular thing happened?",
  "see" :"Did Amanda see that a particular thing happened?",
  "establish":"Did Amanda establish that a particular thing happened?",
  "pretend":"Did Amanda pretend that a particular thing happened?",
  "think":"Does Amanda think that a particular thing happened?",
  "suggest":"Did Amanda suggest that a particular thing happened?",
  "prove":"Did Amanda prove that a particular thing happened?",
  "demonstrate":"Did Amanda demonstrate that a particular thing happened?",
  "say":"Did Amanda say that a particular thing happened?",
  "hear":"Did Amanda hear that a particular thing happened?",
  "confess":"Did Amanda confess that a particular thing happened?",
  "inform_Sam":"Did Amanda inform Sam that a particular thing happened?",
  "announce":"Did Amanda announce that a particular thing happened?",
  "acknowledge":"Did Amanda acknowledge that a particular thing happened?",
  "admit":"Did Amanda admit that a particular thing happened?",
  "confirm":"Did Amanda confirm that a particular thing happened?",
  "be_right_that":"Is Amanda right that a particular thing happened?"
  },
  "12": {
  "gender":"m",
  "content":"that thing happened",
  "annoyed":"Is Melissa annoyed that a particular thing happened?",
  "know":"Does Melissa know that a particular thing happened?",
  "discover":"Did Melissa discover that a particular thing happened?",
  "reveal":"Did Melissa reveal that a particular thing happened?",
  "see" :"Did Melissa see that a particular thing happened?",
  "establish":"Did Melissa establish that a particular thing happened?",
  "pretend":"Did Melissa pretend that a particular thing happened?",
  "think":"Does Melissa think that a particular thing happened?",
  "suggest":"Did Melissa suggest that a particular thing happened?",
  "prove":"Did Melissa prove that a particular thing happened?",
  "demonstrate":"Did Melissa demonstrate that a particular thing happened?",
  "say":"Did Melissa say that a particular thing happened?",
  "hear":"Did Melissa hear that a particular thing happened?",
  "confess":"Did Melissa confess that a particular thing happened?",
  "inform_Sam":"Did Melissa inform Sam that a particular thing happened?",
  "announce":"Did Melissa announce that a particular thing happened?",
  "acknowledge":"Did Melissa acknowledge that a particular thing happened?",
  "admit":"Did Melissa admit that a particular thing happened?",
  "confirm":"Did Melissa confirm that a particular thing happened?",
  "be_right_that":"Is Melissa right that a particular thing happened?"
  },
  "13": {
  "gender":"m",
  "content":"that thing happened",
  "annoyed":"Is Laura annoyed that a particular thing happened?",
  "know":"Does Laura know that a particular thing happened?",
  "discover":"Did Laura discover that a particular thing happened?",
  "reveal":"Did Laura reveal that a particular thing happened?",
  "see" :"Did Laura see that a particular thing happened?",
  "establish":"Did Laura establish that a particular thing happened?",
  "pretend":"Did Laura pretend that a particular thing happened?",
  "think":"Does Laura think that a particular thing happened?",
  "suggest":"Did Laura suggest that a particular thing happened?",
  "prove":"Did Laura prove that a particular thing happened?",
  "demonstrate":"Did Laura demonstrate that a particular thing happened?",
  "say":"Did Laura say that a particular thing happened?",
  "hear":"Did Laura hear that a particular thing happened?",
  "confess":"Did Laura confess that a particular thing happened?",
  "inform_Sam":"Did Laura inform Sam that a particular thing happened?",
  "announce":"Did Laura announce that a particular thing happened?",
  "acknowledge":"Did Laura acknowledge that a particular thing happened?",
  "admit":"Did Laura admit that a particular thing happened?",
  "confirm":"Did Laura confirm that a particular thing happened?",
  "be_right_that":"Is Laura right that a particular thing happened?"
  },
  "14": {
  "gender":"m",
  "content":"that thing happened",
  "annoyed":"Is Stephanie annoyed that a particular thing happened?",
  "know":"Does Stephanie know that a particular thing happened?",
  "discover":"Did Stephanie discover that a particular thing happened?",
  "reveal":"Did Stephanie reveal that a particular thing happened?",
  "see" :"Did Stephanie see that a particular thing happened?",
  "establish":"Did Stephanie establish that a particular thing happened?",
  "pretend":"Did Stephanie pretend that a particular thing happened?",
  "think":"Does Stephanie think that a particular thing happened?",
  "suggest":"Did Stephanie suggest that a particular thing happened?",
  "prove":"Did Stephanie prove that a particular thing happened?",
  "demonstrate":"Did Stephanie demonstrate that a particular thing happened?",
  "say":"Did Stephanie say that a particular thing happened?",
  "hear":"Did Stephanie hear that a particular thing happened?",
  "confess":"Did Stephanie confess that a particular thing happened?",
  "inform_Sam":"Did Stephanie inform Sam that a particular thing happened?",
  "announce":"Did Stephanie announce that a particular thing happened?",
  "acknowledge":"Did Stephanie acknowledge that a particular thing happened?",
  "admit":"Did Stephanie admit that a particular thing happened?",
  "confirm":"Did Stephanie confirm that a particular thing happened?",
  "be_right_that":"Is Stephanie right that a particular thing happened?"
  },
  "15": {
  "gender":"m",
  "content":"that thing happened",
  "annoyed":"Is Rebecca annoyed that a particular thing happened?",
  "know":"Does Rebecca know that a particular thing happened?",
  "discover":"Did Rebecca discover that a particular thing happened?",
  "reveal":"Did Rebecca reveal that a particular thing happened?",
  "see" :"Did Rebecca see that a particular thing happened?",
  "establish":"Did Rebecca establish that a particular thing happened?",
  "pretend":"Did Rebecca pretend that a particular thing happened?",
  "think":"Does Rebecca think that a particular thing happened?",
  "suggest":"Did Rebecca suggest that a particular thing happened?",
  "prove":"Did Rebecca prove that a particular thing happened?",
  "demonstrate":"Did Rebecca demonstrate that a particular thing happened?",
  "say":"Did Rebecca say that a particular thing happened?",
  "hear":"Did Rebecca hear that a particular thing happened?",
  "confess":"Did Rebecca confess that a particular thing happened?",
  "inform_Sam":"Did Rebecca inform Sam that a particular thing happened?",
  "announce":"Did Rebecca announce that a particular thing happened?",
  "acknowledge":"Did Rebecca acknowledge that a particular thing happened?",
  "admit":"Did Rebecca admit that a particular thing happened?",
  "confirm":"Did Rebecca confirm that a particular thing happened?",
  "be_right_that":"Is Rebecca right that a particular thing happened?"
  },
  "16": {
  "gender":"m",
  "content":"that thing happened",
  "annoyed":"Is Sharon annoyed that a particular thing happened?",
  "know":"Does Sharon know that a particular thing happened?",
  "discover":"Did Sharon discover that a particular thing happened?",
  "reveal":"Did Sharon reveal that a particular thing happened?",
  "see" :"Did Sharon see that a particular thing happened?",
  "establish":"Did Sharon establish that a particular thing happened?",
  "pretend":"Did Sharon pretend that a particular thing happened?",
  "think":"Does Sharon think that a particular thing happened?",
  "suggest":"Did Sharon suggest that a particular thing happened?",
  "prove":"Did Sharon prove that a particular thing happened?",
  "demonstrate":"Did Sharon demonstrate that a particular thing happened?",
  "say":"Did Sharon say that a particular thing happened?",
  "hear":"Did Sharon hear that a particular thing happened?",
  "confess":"Did Sharon confess that a particular thing happened?",
  "inform_Sam":"Did Sharon inform Sam that a particular thing happened?",
  "announce":"Did Sharon announce that a particular thing happened?",
  "acknowledge":"Did Sharon acknowledge that a particular thing happened?",
  "admit":"Did Sharon admit that a particular thing happened?",
  "confirm":"Did Sharon confirm that a particular thing happened?",
  "be_right_that":"Is Sharon right that a particular thing happened?"
  },
  "17": {
  "gender":"m",
  "content":"that thing happened",
  "annoyed":"Is Cynthia annoyed that a particular thing happened?",
  "know":"Does Cynthia know that a particular thing happened?",
  "discover":"Did Cynthia discover that a particular thing happened?",
  "reveal":"Did Cynthia reveal that a particular thing happened?",
  "see" :"Did Cynthia see that a particular thing happened?",
  "establish":"Did Cynthia establish that a particular thing happened?",
  "pretend":"Did Cynthia pretend that a particular thing happened?",
  "think":"Does Cynthia think that a particular thing happened?",
  "suggest":"Did Cynthia suggest that a particular thing happened?",
  "prove":"Did Cynthia prove that a particular thing happened?",
  "demonstrate":"Did Cynthia demonstrate that a particular thing happened?",
  "say":"Did Cynthia say that a particular thing happened?",
  "hear":"Did Cynthia hear that a particular thing happened?",
  "confess":"Did Cynthia confess that a particular thing happened?",
  "inform_Sam":"Did Cynthia inform Sam that a particular thing happened?",
  "announce":"Did Cynthia announce that a particular thing happened?",
  "acknowledge":"Did Cynthia acknowledge that a particular thing happened?",
  "admit":"Did Cynthia admit that a particular thing happened?",
  "confirm":"Did Cynthia confirm that a particular thing happened?",
  "be_right_that":"Is Cynthia right that a particular thing happened?"
  },
  "18": {
  "gender":"m",
  "content":"that thing happened",
  "annoyed":"Is Kathleen annoyed that a particular thing happened?",
  "know":"Does Kathleen know that a particular thing happened?",
  "discover":"Did Kathleen discover that a particular thing happened?",
  "reveal":"Did Kathleen reveal that a particular thing happened?",
  "see" :"Did Kathleen see that a particular thing happened?",
  "establish":"Did Kathleen establish that a particular thing happened?",
  "pretend":"Did Kathleen pretend that a particular thing happened?",
  "think":"Does Kathleen think that a particular thing happened?",
  "suggest":"Did Kathleen suggest that a particular thing happened?",
  "prove":"Did Kathleen prove that a particular thing happened?",
  "demonstrate":"Did Kathleen demonstrate that a particular thing happened?",
  "say":"Did Kathleen say that a particular thing happened?",
  "hear":"Did Kathleen hear that a particular thing happened?",
  "confess":"Did Kathleen confess that a particular thing happened?",
  "inform_Sam":"Did Kathleen inform Sam that a particular thing happened?",
  "announce":"Did Kathleen announce that a particular thing happened?",
  "acknowledge":"Did Kathleen acknowledge that a particular thing happened?",
  "admit":"Did Kathleen admit that a particular thing happened?",
  "confirm":"Did Kathleen confirm that a particular thing happened?",
  "be_right_that":"Is Kathleen right that a particular thing happened?"
  },
  "19": {
  "gender":"m",
  "content":"that thing happened",
  "annoyed":"Is Ruth annoyed that a particular thing happened?",
  "know":"Does Ruth know that a particular thing happened?",
  "discover":"Did Ruth discover that a particular thing happened?",
  "reveal":"Did Ruth reveal that a particular thing happened?",
  "see" :"Did Ruth see that a particular thing happened?",
  "establish":"Did Ruth establish that a particular thing happened?",
  "pretend":"Did Ruth pretend that a particular thing happened?",
  "think":"Does Ruth think that a particular thing happened?",
  "suggest":"Did Ruth suggest that a particular thing happened?",
  "prove":"Did Ruth prove that a particular thing happened?",
  "demonstrate":"Did Ruth demonstrate that a particular thing happened?",
  "say":"Did Ruth say that a particular thing happened?",
  "hear":"Did Ruth hear that a particular thing happened?",
  "confess":"Did Ruth confess that a particular thing happened?",
  "inform_Sam":"Did Ruth inform Sam that a particular thing happened?",
  "announce":"Did Ruth announce that a particular thing happened?",
  "acknowledge":"Did Ruth acknowledge that a particular thing happened?",
  "admit":"Did Ruth admit that a particular thing happened?",
  "confirm":"Did Ruth confirm that a particular thing happened?",
  "be_right_that":"Is Ruth right that a particular thing happened?"
  },
  "20": {
  "gender":"m",
  "content":"that thing happened",
  "annoyed":"Is Anna annoyed that a particular thing happened?",
  "know":"Does Anna know that a particular thing happened?",
  "discover":"Did Anna discover that a particular thing happened?",
  "reveal":"Did Anna reveal that a particular thing happened?",
  "see" :"Did Anna see that a particular thing happened?",
  "establish":"Did Anna establish that a particular thing happened?",
  "pretend":"Did Anna pretend that a particular thing happened?",
  "think":"Does Anna think that a particular thing happened?",
  "suggest":"Did Anna suggest that a particular thing happened?",
  "prove":"Did Anna prove that a particular thing happened?",
  "demonstrate":"Did Anna demonstrate that a particular thing happened?",
  "say":"Did Anna say that a particular thing happened?",
  "hear":"Did Anna hear that a particular thing happened?",
  "confess":"Did Anna confess that a particular thing happened?",
  "inform_Sam":"Did Anna inform Sam that a particular thing happened?",
  "announce":"Did Anna announce that a particular thing happened?",
  "acknowledge":"Did Anna acknowledge that a particular thing happened?",
  "admit":"Did Anna admit that a particular thing happened?",
  "confirm":"Did Anna confirm that a particular thing happened?",
  "be_right_that":"Is Anna right that a particular thing happened?"
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
	"utterance" : "Is Zack coming to the meeting tomorrow, even though a particular thing happened last night?",
	"content" : "that thing happened",
	// "content" : "Zack is coming to the meeting tomorrow",
	"fact" : "Zack is a member of the golf club"
    },
    {
	"item_id" : "control2",
	"short_trigger" : "control",
	"utterance" : "Did Mary's aunt get sick before or after a particular thing happened?",
	"content" : "that thing happened",
	// "content" : "Mary's aunt is sick",
	"fact" : "Mary visited her aunt on Sunday"
    },
    {
	"item_id" : "control3",
	"short_trigger" : "control",
	"utterance" : "Did Todd stop playing football in high school, despite the fact that a particular thing happened?",
	"content" : "that thing happened",
	// "content" : "Todd used to play football in high school",
	"fact" : "Todd goes to the gym 3 times a week"
    },
    {
	"item_id" : "control4",
	"short_trigger" : "control",
	"utterance" : "Did Vanessa improve at math, now that a particular thing happened?",
	"content" : "that thing happened",
	// "content" : "Vanessa is good at math",
	"fact" : "Vanessa won a prize at school"
    },
    {
	"item_id" : "control5",
	"short_trigger" : "control",
	"utterance" : "Did Madison have a baby, despite the fact that a particular thing happened?",
	"content" : "that thing happened",
	// "content" : "Madison had a baby",
	"fact" : "Trish sent Madison a card"
    },
    {
	"item_id" : "control6",
	"short_trigger" : "control",
	"utterance" : "Did Hendrick's car get more expensive, now that a particular thing happened?",
	"content" : "that thing happened",
	// "content" : "Hendrick's car got more expensive",
	"fact" : "Hendrick just bought a car"
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
	  "name2": "NA",
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
