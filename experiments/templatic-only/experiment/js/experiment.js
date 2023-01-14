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
	var utterance = "You are at a party. You walk into the kitchen and overhear " + this.stim.name + " ask somebody else a question. The party is very noisy, and you only hear part of what is said. The part you don't hear is represented by the 'X'.";
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
  "content":"X happened",
  "annoyed":"Is Patrick annoyed that X happened?",
  "know":"Does Patrick know that X happened?",
  "discover":"Did Patrick discover that X happened?",
  "reveal":"Did Patrick reveal that X happened?",
  "see" :"Did Patrick see that X happened?",
  "establish":"Did Patrick establish that X happened?",
  "pretend":"Did Patrick pretend that X happened?",
  "think":"Does Patrick think that X happened?",
  "suggest":"Did Patrick suggest that X happened?",
  "prove":"Did Patrick prove that X happened?",
  "demonstrate":"Did Patrick demonstrate that X happened?",
  "say":"Did Patrick say that X happened?",
  "hear":"Did Patrick hear that X happened?",
  "confess":"Did Patrick confess that X happened?",
  "inform_Sam":"Did Patrick inform Sam that X happened?",
  "announce":"Did Patrick announce that X happened?",
  "acknowledge":"Did Patrick acknowledge that X happened?",
  "admit":"Did Patrick admit that X happened?",
  "confirm":"Did Patrick confirm that X happened?",
  "be_right_that":"Is Patrick right that X happened?"
  },
  "2": {
  "gender":"f",
  "content":"X happened",
  "annoyed":"Is Scott annoyed that X happened?",
  "know":"Does Scott know that X happened?",
  "discover":"Did Scott discover that X happened?",
  "reveal":"Did Scott reveal that X happened?",
  "see" :"Did Scott see that X happened?",
  "establish":"Did Scott establish that X happened?",
  "pretend":"Did Scott pretend that X happened?",
  "think":"Does Scott think that X happened?",
  "suggest":"Did Scott suggest that X happened?",
  "prove":"Did Scott prove that X happened?",
  "demonstrate":"Did Scott demonstrate that X happened?",
  "say":"Did Scott say that X happened?",
  "hear":"Did Scott hear that X happened?",
  "confess":"Did Scott confess that X happened?",
  "inform_Sam":"Did Scott inform Sam that X happened?",
  "announce":"Did Scott announce that X happened?",
  "acknowledge":"Did Scott acknowledge that X happened?",
  "admit":"Did Scott admit that X happened?",
  "confirm":"Did Scott confirm that X happened?",
  "be_right_that":"Is Scott right that X happened?"
  },
  "3": {
  "gender":"f",
  "content":"X happened",
  "annoyed":"Is Justin annoyed that X happened?",
  "know":"Does Justin know that X happened?",
  "discover":"Did Justin discover that X happened?",
  "reveal":"Did Justin reveal that X happened?",
  "see" :"Did Justin see that X happened?",
  "establish":"Did Justin establish that X happened?",
  "pretend":"Did Justin pretend that X happened?",
  "think":"Does Justin think that X happened?",
  "suggest":"Did Justin suggest that X happened?",
  "prove":"Did Justin prove that X happened?",
  "demonstrate":"Did Justin demonstrate that X happened?",
  "say":"Did Justin say that X happened?",
  "hear":"Did Justin hear that X happened?",
  "confess":"Did Justin confess that X happened?",
  "inform_Sam":"Did Justin inform Sam that X happened?",
  "announce":"Did Justin announce that X happened?",
  "acknowledge":"Did Justin acknowledge that X happened?",
  "admit":"Did Justin admit that X happened?",
  "confirm":"Did Justin confirm that X happened?",
  "be_right_that":"Is Justin right that X happened?"
  },
  "4": {
  "gender":"f",
  "content":"X happened",
  "annoyed":"Is Jerry annoyed that X happened?",
  "know":"Does Jerry know that X happened?",
  "discover":"Did Jerry discover that X happened?",
  "reveal":"Did Jerry reveal that X happened?",
  "see" :"Did Jerry see that X happened?",
  "establish":"Did Jerry establish that X happened?",
  "pretend":"Did Jerry pretend that X happened?",
  "think":"Does Jerry think that X happened?",
  "suggest":"Did Jerry suggest that X happened?",
  "prove":"Did Jerry prove that X happened?",
  "demonstrate":"Did Jerry demonstrate that X happened?",
  "say":"Did Jerry say that X happened?",
  "hear":"Did Jerry hear that X happened?",
  "confess":"Did Jerry confess that X happened?",
  "inform_Sam":"Did Jerry inform Sam that X happened?",
  "announce":"Did Jerry announce that X happened?",
  "acknowledge":"Did Jerry acknowledge that X happened?",
  "admit":"Did Jerry admit that X happened?",
  "confirm":"Did Jerry confirm that X happened?",
  "be_right_that":"Is Jerry right that X happened?"
  },
  "5": {
  "gender":"f",
  "content":"X happened",
  "annoyed":"Is Ben annoyed that X happened?",
  "know":"Does Ben know that X happened?",
  "discover":"Did Ben discover that X happened?",
  "reveal":"Did Ben reveal that X happened?",
  "see" :"Did Ben see that X happened?",
  "establish":"Did Ben establish that X happened?",
  "pretend":"Did Ben pretend that X happened?",
  "think":"Does Ben think that X happened?",
  "suggest":"Did Ben suggest that X happened?",
  "prove":"Did Ben prove that X happened?",
  "demonstrate":"Did Ben demonstrate that X happened?",
  "say":"Did Ben say that X happened?",
  "hear":"Did Ben hear that X happened?",
  "confess":"Did Ben confess that X happened?",
  "inform_Sam":"Did Ben inform Sam that X happened?",
  "announce":"Did Ben announce that X happened?",
  "acknowledge":"Did Ben acknowledge that X happened?",
  "admit":"Did Ben admit that X happened?",
  "confirm":"Did Ben confirm that X happened?",
  "be_right_that":"Is Ben right that X happened?"
  },
  "6": {
  "gender":"f",
  "content":"X happened",
  "annoyed":"Is Ray annoyed that X happened?",
  "know":"Does Ray know that X happened?",
  "discover":"Did Ray discover that X happened?",
  "reveal":"Did Ray reveal that X happened?",
  "see" :"Did Ray see that X happened?",
  "establish":"Did Ray establish that X happened?",
  "pretend":"Did Ray pretend that X happened?",
  "think":"Does Ray think that X happened?",
  "suggest":"Did Ray suggest that X happened?",
  "prove":"Did Ray prove that X happened?",
  "demonstrate":"Did Ray demonstrate that X happened?",
  "say":"Did Ray say that X happened?",
  "hear":"Did Ray hear that X happened?",
  "confess":"Did Ray confess that X happened?",
  "inform_Sam":"Did Ray inform Sam that X happened?",
  "announce":"Did Ray announce that X happened?",
  "acknowledge":"Did Ray acknowledge that X happened?",
  "admit":"Did Ray admit that X happened?",
  "confirm":"Did Ray confirm that X happened?",
  "be_right_that":"Is Ray right that X happened?"
  },
  "7": {
  "gender":"f",
  "content":"X happened",
  "annoyed":"Is Kevin annoyed that X happened?",
  "know":"Does Kevin know that X happened?",
  "discover":"Did Kevin discover that X happened?",
  "reveal":"Did Kevin reveal that X happened?",
  "see" :"Did Kevin see that X happened?",
  "establish":"Did Kevin establish that X happened?",
  "pretend":"Did Kevin pretend that X happened?",
  "think":"Does Kevin think that X happened?",
  "suggest":"Did Kevin suggest that X happened?",
  "prove":"Did Kevin prove that X happened?",
  "demonstrate":"Did Kevin demonstrate that X happened?",
  "say":"Did Kevin say that X happened?",
  "hear":"Did Kevin hear that X happened?",
  "confess":"Did Kevin confess that X happened?",
  "inform_Sam":"Did Kevin inform Sam that X happened?",
  "announce":"Did Kevin announce that X happened?",
  "acknowledge":"Did Kevin acknowledge that X happened?",
  "admit":"Did Kevin admit that X happened?",
  "confirm":"Did Kevin confirm that X happened?",
  "be_right_that":"Is Kevin right that X happened?"
  },
  "8": {
  "gender":"f",
  "content":"X happened",
  "annoyed":"Is Brian annoyed that X happened?",
  "know":"Does Brian know that X happened?",
  "discover":"Did Brian discover that X happened?",
  "reveal":"Did Brian reveal that X happened?",
  "see" :"Did Brian see that X happened?",
  "establish":"Did Brian establish that X happened?",
  "pretend":"Did Brian pretend that X happened?",
  "think":"Does Brian think that X happened?",
  "suggest":"Did Brian suggest that X happened?",
  "prove":"Did Brian prove that X happened?",
  "demonstrate":"Did Brian demonstrate that X happened?",
  "say":"Did Brian say that X happened?",
  "hear":"Did Brian hear that X happened?",
  "confess":"Did Brian confess that X happened?",
  "inform_Sam":"Did Brian inform Sam that X happened?",
  "announce":"Did Brian announce that X happened?",
  "acknowledge":"Did Brian acknowledge that X happened?",
  "admit":"Did Brian admit that X happened?",
  "confirm":"Did Brian confirm that X happened?",
  "be_right_that":"Is Brian right that X happened?"
  },
  "9": {
  "gender":"f",
  "content":"X happened",
  "annoyed":"Is Andrew annoyed that X happened?",
  "know":"Does Andrew know that X happened?",
  "discover":"Did Andrew discover that X happened?",
  "reveal":"Did Andrew reveal that X happened?",
  "see" :"Did Andrew see that X happened?",
  "establish":"Did Andrew establish that X happened?",
  "pretend":"Did Andrew pretend that X happened?",
  "think":"Does Andrew think that X happened?",
  "suggest":"Did Andrew suggest that X happened?",
  "prove":"Did Andrew prove that X happened?",
  "demonstrate":"Did Andrew demonstrate that X happened?",
  "say":"Did Andrew say that X happened?",
  "hear":"Did Andrew hear that X happened?",
  "confess":"Did Andrew confess that X happened?",
  "inform_Sam":"Did Andrew inform Sam that X happened?",
  "announce":"Did Andrew announce that X happened?",
  "acknowledge":"Did Andrew acknowledge that X happened?",
  "admit":"Did Andrew admit that X happened?",
  "confirm":"Did Andrew confirm that X happened?",
  "be_right_that":"Is Andrew right that X happened?"
  },
  "10": {
  "gender":"f",
  "content":"X happened",
  "annoyed":"Is Tim annoyed that X happened?",
  "know":"Does Tim know that X happened?",
  "discover":"Did Tim discover that X happened?",
  "reveal":"Did Tim reveal that X happened?",
  "see" :"Did Tim see that X happened?",
  "establish":"Did Tim establish that X happened?",
  "pretend":"Did Tim pretend that X happened?",
  "think":"Does Tim think that X happened?",
  "suggest":"Did Tim suggest that X happened?",
  "prove":"Did Tim prove that X happened?",
  "demonstrate":"Did Tim demonstrate that X happened?",
  "say":"Did Tim say that X happened?",
  "hear":"Did Tim hear that X happened?",
  "confess":"Did Tim confess that X happened?",
  "inform_Sam":"Did Tim inform Sam that X happened?",
  "announce":"Did Tim announce that X happened?",
  "acknowledge":"Did Tim acknowledge that X happened?",
  "admit":"Did Tim admit that X happened?",
  "confirm":"Did Tim confirm that X happened?",
  "be_right_that":"Is Tim right that X happened?"
  },
  "11": {
  "gender":"m",
  "content":"X happened",
  "annoyed":"Is Amanda annoyed that X happened?",
  "know":"Does Amanda know that X happened?",
  "discover":"Did Amanda discover that X happened?",
  "reveal":"Did Amanda reveal that X happened?",
  "see" :"Did Amanda see that X happened?",
  "establish":"Did Amanda establish that X happened?",
  "pretend":"Did Amanda pretend that X happened?",
  "think":"Does Amanda think that X happened?",
  "suggest":"Did Amanda suggest that X happened?",
  "prove":"Did Amanda prove that X happened?",
  "demonstrate":"Did Amanda demonstrate that X happened?",
  "say":"Did Amanda say that X happened?",
  "hear":"Did Amanda hear that X happened?",
  "confess":"Did Amanda confess that X happened?",
  "inform_Sam":"Did Amanda inform Sam that X happened?",
  "announce":"Did Amanda announce that X happened?",
  "acknowledge":"Did Amanda acknowledge that X happened?",
  "admit":"Did Amanda admit that X happened?",
  "confirm":"Did Amanda confirm that X happened?",
  "be_right_that":"Is Amanda right that X happened?"
  },
  "12": {
  "gender":"m",
  "content":"X happened",
  "annoyed":"Is Melissa annoyed that X happened?",
  "know":"Does Melissa know that X happened?",
  "discover":"Did Melissa discover that X happened?",
  "reveal":"Did Melissa reveal that X happened?",
  "see" :"Did Melissa see that X happened?",
  "establish":"Did Melissa establish that X happened?",
  "pretend":"Did Melissa pretend that X happened?",
  "think":"Does Melissa think that X happened?",
  "suggest":"Did Melissa suggest that X happened?",
  "prove":"Did Melissa prove that X happened?",
  "demonstrate":"Did Melissa demonstrate that X happened?",
  "say":"Did Melissa say that X happened?",
  "hear":"Did Melissa hear that X happened?",
  "confess":"Did Melissa confess that X happened?",
  "inform_Sam":"Did Melissa inform Sam that X happened?",
  "announce":"Did Melissa announce that X happened?",
  "acknowledge":"Did Melissa acknowledge that X happened?",
  "admit":"Did Melissa admit that X happened?",
  "confirm":"Did Melissa confirm that X happened?",
  "be_right_that":"Is Melissa right that X happened?"
  },
  "13": {
  "gender":"m",
  "content":"X happened",
  "annoyed":"Is Laura annoyed that X happened?",
  "know":"Does Laura know that X happened?",
  "discover":"Did Laura discover that X happened?",
  "reveal":"Did Laura reveal that X happened?",
  "see" :"Did Laura see that X happened?",
  "establish":"Did Laura establish that X happened?",
  "pretend":"Did Laura pretend that X happened?",
  "think":"Does Laura think that X happened?",
  "suggest":"Did Laura suggest that X happened?",
  "prove":"Did Laura prove that X happened?",
  "demonstrate":"Did Laura demonstrate that X happened?",
  "say":"Did Laura say that X happened?",
  "hear":"Did Laura hear that X happened?",
  "confess":"Did Laura confess that X happened?",
  "inform_Sam":"Did Laura inform Sam that X happened?",
  "announce":"Did Laura announce that X happened?",
  "acknowledge":"Did Laura acknowledge that X happened?",
  "admit":"Did Laura admit that X happened?",
  "confirm":"Did Laura confirm that X happened?",
  "be_right_that":"Is Laura right that X happened?"
  },
  "14": {
  "gender":"m",
  "content":"X happened",
  "annoyed":"Is Stephanie annoyed that X happened?",
  "know":"Does Stephanie know that X happened?",
  "discover":"Did Stephanie discover that X happened?",
  "reveal":"Did Stephanie reveal that X happened?",
  "see" :"Did Stephanie see that X happened?",
  "establish":"Did Stephanie establish that X happened?",
  "pretend":"Did Stephanie pretend that X happened?",
  "think":"Does Stephanie think that X happened?",
  "suggest":"Did Stephanie suggest that X happened?",
  "prove":"Did Stephanie prove that X happened?",
  "demonstrate":"Did Stephanie demonstrate that X happened?",
  "say":"Did Stephanie say that X happened?",
  "hear":"Did Stephanie hear that X happened?",
  "confess":"Did Stephanie confess that X happened?",
  "inform_Sam":"Did Stephanie inform Sam that X happened?",
  "announce":"Did Stephanie announce that X happened?",
  "acknowledge":"Did Stephanie acknowledge that X happened?",
  "admit":"Did Stephanie admit that X happened?",
  "confirm":"Did Stephanie confirm that X happened?",
  "be_right_that":"Is Stephanie right that X happened?"
  },
  "15": {
  "gender":"m",
  "content":"X happened",
  "annoyed":"Is Rebecca annoyed that X happened?",
  "know":"Does Rebecca know that X happened?",
  "discover":"Did Rebecca discover that X happened?",
  "reveal":"Did Rebecca reveal that X happened?",
  "see" :"Did Rebecca see that X happened?",
  "establish":"Did Rebecca establish that X happened?",
  "pretend":"Did Rebecca pretend that X happened?",
  "think":"Does Rebecca think that X happened?",
  "suggest":"Did Rebecca suggest that X happened?",
  "prove":"Did Rebecca prove that X happened?",
  "demonstrate":"Did Rebecca demonstrate that X happened?",
  "say":"Did Rebecca say that X happened?",
  "hear":"Did Rebecca hear that X happened?",
  "confess":"Did Rebecca confess that X happened?",
  "inform_Sam":"Did Rebecca inform Sam that X happened?",
  "announce":"Did Rebecca announce that X happened?",
  "acknowledge":"Did Rebecca acknowledge that X happened?",
  "admit":"Did Rebecca admit that X happened?",
  "confirm":"Did Rebecca confirm that X happened?",
  "be_right_that":"Is Rebecca right that X happened?"
  },
  "16": {
  "gender":"m",
  "content":"X happened",
  "annoyed":"Is Sharon annoyed that X happened?",
  "know":"Does Sharon know that X happened?",
  "discover":"Did Sharon discover that X happened?",
  "reveal":"Did Sharon reveal that X happened?",
  "see" :"Did Sharon see that X happened?",
  "establish":"Did Sharon establish that X happened?",
  "pretend":"Did Sharon pretend that X happened?",
  "think":"Does Sharon think that X happened?",
  "suggest":"Did Sharon suggest that X happened?",
  "prove":"Did Sharon prove that X happened?",
  "demonstrate":"Did Sharon demonstrate that X happened?",
  "say":"Did Sharon say that X happened?",
  "hear":"Did Sharon hear that X happened?",
  "confess":"Did Sharon confess that X happened?",
  "inform_Sam":"Did Sharon inform Sam that X happened?",
  "announce":"Did Sharon announce that X happened?",
  "acknowledge":"Did Sharon acknowledge that X happened?",
  "admit":"Did Sharon admit that X happened?",
  "confirm":"Did Sharon confirm that X happened?",
  "be_right_that":"Is Sharon right that X happened?"
  },
  "17": {
  "gender":"m",
  "content":"X happened",
  "annoyed":"Is Cynthia annoyed that X happened?",
  "know":"Does Cynthia know that X happened?",
  "discover":"Did Cynthia discover that X happened?",
  "reveal":"Did Cynthia reveal that X happened?",
  "see" :"Did Cynthia see that X happened?",
  "establish":"Did Cynthia establish that X happened?",
  "pretend":"Did Cynthia pretend that X happened?",
  "think":"Does Cynthia think that X happened?",
  "suggest":"Did Cynthia suggest that X happened?",
  "prove":"Did Cynthia prove that X happened?",
  "demonstrate":"Did Cynthia demonstrate that X happened?",
  "say":"Did Cynthia say that X happened?",
  "hear":"Did Cynthia hear that X happened?",
  "confess":"Did Cynthia confess that X happened?",
  "inform_Sam":"Did Cynthia inform Sam that X happened?",
  "announce":"Did Cynthia announce that X happened?",
  "acknowledge":"Did Cynthia acknowledge that X happened?",
  "admit":"Did Cynthia admit that X happened?",
  "confirm":"Did Cynthia confirm that X happened?",
  "be_right_that":"Is Cynthia right that X happened?"
  },
  "18": {
  "gender":"m",
  "content":"X happened",
  "annoyed":"Is Kathleen annoyed that X happened?",
  "know":"Does Kathleen know that X happened?",
  "discover":"Did Kathleen discover that X happened?",
  "reveal":"Did Kathleen reveal that X happened?",
  "see" :"Did Kathleen see that X happened?",
  "establish":"Did Kathleen establish that X happened?",
  "pretend":"Did Kathleen pretend that X happened?",
  "think":"Does Kathleen think that X happened?",
  "suggest":"Did Kathleen suggest that X happened?",
  "prove":"Did Kathleen prove that X happened?",
  "demonstrate":"Did Kathleen demonstrate that X happened?",
  "say":"Did Kathleen say that X happened?",
  "hear":"Did Kathleen hear that X happened?",
  "confess":"Did Kathleen confess that X happened?",
  "inform_Sam":"Did Kathleen inform Sam that X happened?",
  "announce":"Did Kathleen announce that X happened?",
  "acknowledge":"Did Kathleen acknowledge that X happened?",
  "admit":"Did Kathleen admit that X happened?",
  "confirm":"Did Kathleen confirm that X happened?",
  "be_right_that":"Is Kathleen right that X happened?"
  },
  "19": {
  "gender":"m",
  "content":"X happened",
  "annoyed":"Is Ruth annoyed that X happened?",
  "know":"Does Ruth know that X happened?",
  "discover":"Did Ruth discover that X happened?",
  "reveal":"Did Ruth reveal that X happened?",
  "see" :"Did Ruth see that X happened?",
  "establish":"Did Ruth establish that X happened?",
  "pretend":"Did Ruth pretend that X happened?",
  "think":"Does Ruth think that X happened?",
  "suggest":"Did Ruth suggest that X happened?",
  "prove":"Did Ruth prove that X happened?",
  "demonstrate":"Did Ruth demonstrate that X happened?",
  "say":"Did Ruth say that X happened?",
  "hear":"Did Ruth hear that X happened?",
  "confess":"Did Ruth confess that X happened?",
  "inform_Sam":"Did Ruth inform Sam that X happened?",
  "announce":"Did Ruth announce that X happened?",
  "acknowledge":"Did Ruth acknowledge that X happened?",
  "admit":"Did Ruth admit that X happened?",
  "confirm":"Did Ruth confirm that X happened?",
  "be_right_that":"Is Ruth right that X happened?"
  },
  "20": {
  "gender":"m",
  "content":"X happened",
  "annoyed":"Is Anna annoyed that X happened?",
  "know":"Does Anna know that X happened?",
  "discover":"Did Anna discover that X happened?",
  "reveal":"Did Anna reveal that X happened?",
  "see" :"Did Anna see that X happened?",
  "establish":"Did Anna establish that X happened?",
  "pretend":"Did Anna pretend that X happened?",
  "think":"Does Anna think that X happened?",
  "suggest":"Did Anna suggest that X happened?",
  "prove":"Did Anna prove that X happened?",
  "demonstrate":"Did Anna demonstrate that X happened?",
  "say":"Did Anna say that X happened?",
  "hear":"Did Anna hear that X happened?",
  "confess":"Did Anna confess that X happened?",
  "inform_Sam":"Did Anna inform Sam that X happened?",
  "announce":"Did Anna announce that X happened?",
  "acknowledge":"Did Anna acknowledge that X happened?",
  "admit":"Did Anna admit that X happened?",
  "confirm":"Did Anna confirm that X happened?",
  "be_right_that":"Is Anna right that X happened?"
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
	"utterance" : "Is Zack coming to the meeting tomorrow, even though X happened last night?",
	"content" : "X happened",
	// "content" : "Zack is coming to the meeting tomorrow",
	"fact" : "Zack is a member of the golf club"
    },
    {
	"item_id" : "control2",
	"short_trigger" : "control",
	"utterance" : "Did Mary's aunt get sick before or after X happened?",
	"content" : "X happened",
	// "content" : "Mary's aunt is sick",
	"fact" : "Mary visited her aunt on Sunday"
    },
    {
	"item_id" : "control3",
	"short_trigger" : "control",
	"utterance" : "Did Todd stop playing football in high school, despite the fact that X happened?",
	"content" : "X happened",
	// "content" : "Todd used to play football in high school",
	"fact" : "Todd goes to the gym 3 times a week"
    },
    {
	"item_id" : "control4",
	"short_trigger" : "control",
	"utterance" : "Did Vanessa improve at math, now that X happened?",
	"content" : "X happened",
	// "content" : "Vanessa is good at math",
	"fact" : "Vanessa won a prize at school"
    },
    {
	"item_id" : "control5",
	"short_trigger" : "control",
	"utterance" : "Did Madison have a baby, despite the fact that X happened?",
	"content" : "X happened",
	// "content" : "Madison had a baby",
	"fact" : "Trish sent Madison a card"
    },
    {
	"item_id" : "control6",
	"short_trigger" : "control",
	"utterance" : "Did Hendrick's car get more expensive, now that X happened?",
	"content" : "X happened",
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
