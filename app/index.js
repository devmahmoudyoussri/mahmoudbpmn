'use strict';

var fs = require('fs');

var $ = require('jquery'),
    BpmnModeler = require('bpmn-js/lib/Modeler');


var propertiesPanelModule = require('bpmn-js-properties-panel'),
    propertiesProviderModule = require('./provider/magic'),
    magicModdleDescriptor = require('./descriptors/magic');

var container = $('#js-drop-zone');

var canvas = $('#js-canvas');

var bpmnModeler = new BpmnModeler({
    container: canvas,
    propertiesPanel: {
        parent: '#js-properties-panel'
    },
    additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule
    ],
    moddleExtensions: {
        magic: magicModdleDescriptor
    }
});

var newDiagramXML = fs.readFileSync(__dirname + '/../resources/newDiagram.bpmn', 'utf-8');

function createNewDiagram() {
    openDiagram(newDiagramXML);
}

function openDiagram(xml) {

    bpmnModeler.importXML(xml, function (err) {

        if (err) {
            container
                .removeClass('with-diagram')
                .addClass('with-error');

            container.find('.error pre').text(err.message);

            console.error(err);
        } else {
            container
                .removeClass('with-error')
                .addClass('with-diagram');
        }


    });
}

function saveSVG(done) {
    bpmnModeler.saveSVG(done);
}

function saveDiagram(done) {

    bpmnModeler.saveXML({ format: true }, function (err, xml) {
        done(err, xml);
    });
}

function saveXML(done) {

    bpmnModeler.saveXML({ format: true }, function (err, xml) {
        done(err, xml);
    });
}


function GenerateXML(Praticipaties, processName) {

    var xml = '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">' +
        '<bpmn2:collaboration id="Collaboration_0zgb8kn">' +
        '<bpmn2:participant id="Participant_1xc7qyx" name="' + processName + '" processRef="' + processName + '_1" />' +
        '</bpmn2:collaboration>';



    xml += '<bpmn2:process id="' + processName + '_1" isExecutable="false">' +
        '<bpmn2:laneSet>';
    for (var i = 0; i < Praticipaties.length; i++) {

        xml += '<bpmn2:lane id="' + (Praticipaties[i][0]).trim() + '_' + i + '" name="' + Praticipaties[i][0] + '" >'

        if (Praticipaties[i][1].length > 0) {

            xml += '<bpmn2:childLaneSet xsi:type="bpmn2:tLaneSet">';
            for (var j = 0; j < Praticipaties[i][1].length; j++) {
                xml += ' <bpmn2:lane id="Lane_' + Praticipaties[i][1][j] + '" name="' + Praticipaties[i][1][j] + '" />'
            }
            xml += '</bpmn2:childLaneSet>';
        }
        xml += '</bpmn2:lane>';
    }

    xml += '</bpmn2:laneSet>' +
        '</bpmn2:process>';



    xml += '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
        '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_0zgb8kn">';

    //main shape
    //Draw hight 
    var height = 181;
    var totatheight = (height * (Praticipaties.length));

    var startY = 92;
    var y = new Array();



    xml += '<bpmndi:BPMNShape id="Participant_1bp7lga_di" bpmnElement="Participant_1xc7qyx">' +
        '<dc:Bounds x= "269" y= "92" width= "654" height= "' + totatheight + '" />' +
        '</bpmndi:BPMNShape>';


    for (var i = 0; i < Praticipaties.length; i++) {
        if (i == 0) y.push(startY);
        else y.push((y[i - 1] + height));
    }



    for (var i = 0; i < Praticipaties.length; i++) {
        if (Praticipaties[i][1].length == 0) {

            xml += '<bpmndi:BPMNShape id="Participant_' + (Praticipaties[i][0]).trim() + '" bpmnElement="' + (Praticipaties[i][0]).trim() + '_' + i + '">' +
                '<dc:Bounds x= "299" y= "' + y[i] + '" width= "624" height= "' + height + '" />' +
                '</bpmndi:BPMNShape>';

        }
        if (Praticipaties[i][1].length > 0) {

            var startChildY = y[i];
            var Childy = new Array();

            for (var h = 0; h < Praticipaties[i][1].length; h++) {
                if (h == 0) Childy.push(startChildY);
                else Childy.push((Childy[h - 1] + (height / Praticipaties[i].length)));
            }

            for (var j = 0; j < Praticipaties[i][1].length; j++) {

                xml += '<bpmndi:BPMNShape id="Participant_' + (Praticipaties[i][1][j]).trim() + '" bpmnElement="Lane_' + Praticipaties[i][1][j] + '">' +
                    '<dc:Bounds x= "299" y= "' + Childy[j] + '" width= "624" height= "' + (height / Praticipaties[i].length) + '" />' +
                    '</bpmndi:BPMNShape>';
            }
        }
    }



    xml += '</bpmndi:BPMNPlane>' +
        '</bpmndi:BPMNDiagram >' +
        '</bpmn2:definitions >';



    var Result = xml;


    if (Praticipaties[0][1].length > 2) {
        var xmldefinitions = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
            "<bpmn:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" id=\"Definitions_1\" targetNamespace=\"http://bpmn.io/schema/bpmn\">";

        // process Name
        var xmlcollaboration = "<bpmn:collaboration id=\"Collaboration_0zgb8kn\">";
        xmlcollaboration += "<bpmn:participant id=\"Participant_1xc7qyx\" name=\"" + processName + "\" processRef=\"" + processName + "_1\" />" +
            "</bpmn:collaboration>";




        //process
        var xmlprocess = "<bpmn:process id=\"" + processName + "_1\" isExecutable=\"false\">" +

            "<bpmn:laneSet>" +
            "<bpmn:lane id=\"Lane_18619ti\" name=\"" + Praticipaties[0][0] + "\">" +
            "<bpmn:childLaneSet xsi:type=\"bpmn:tLaneSet\">" +
            "<bpmn:lane id=\"Lane_136ofcn\" name=\"" + Praticipaties[0][1][0] + "\" /><bpmn:lane id=\"Lane_0d7032a\" name=\"" + Praticipaties[0][1][1] + "\" /><bpmn:lane id=\"Lane_0nufip1\" name=\"" + Praticipaties[0][1][2] + "\"><bpmn:childLaneSet xsi:type=\"bpmn:tLaneSet\"><bpmn:lane id=\"Lane_0rpu5dc\" name=\"part child 3 child1\" /><bpmn:lane id=\"Lane_1ytsy38\" /></bpmn:childLaneSet></bpmn:lane></bpmn:childLaneSet></bpmn:lane>" +
            "<bpmn:lane id=\"Lane_02me99c\" name=\"" + "part 2"+ "\" />" +
            "</bpmn:laneSet>" +


            "</bpmn:process>";






        var xmldiagram = "<bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">" +
            "<bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Collaboration_0zgb8kn\">" +
            "<bpmndi:BPMNShape id=\"Participant_1xc7qyx_di\" bpmnElement=\"Participant_1xc7qyx\">" +
            "<dc:Bounds x=\"163\" y=\"33\" width=\"765\" height=\"520\" /></bpmndi:BPMNShape>" +
            "<bpmndi:BPMNShape id=\"Lane_18619ti_di\" bpmnElement=\"Lane_18619ti\">" +
            "<dc:Bounds x=\"193\" y=\"33\" width=\"735\" height=\"320\" /></bpmndi:BPMNShape>" +
            "<bpmndi:BPMNShape id=\"Lane_02me99c_di\" bpmnElement=\"Lane_02me99c\"><dc:Bounds x=\"193\" y=\"353\" width=\"735\" height=\"200\" /></bpmndi:BPMNShape>" +

            "<bpmndi:BPMNShape id=\"Lane_136ofcn_di\" bpmnElement=\"Lane_136ofcn\"><dc:Bounds x=\"223\" y=\"33\" width=\"705\" height=\"100\" /></bpmndi:BPMNShape><bpmndi:BPMNShape id=\"Lane_0d7032a_di\" bpmnElement=\"Lane_0d7032a\"><dc:Bounds x=\"223\" y=\"253\" width=\"705\" height=\"100\" /></bpmndi:BPMNShape><bpmndi:BPMNShape id=\"Lane_0nufip1_di\" bpmnElement=\"Lane_0nufip1\"><dc:Bounds x=\"223\" y=\"133\" width=\"705\" height=\"120\" /></bpmndi:BPMNShape><bpmndi:BPMNShape id=\"Lane_0rpu5dc_di\" bpmnElement=\"Lane_0rpu5dc\"><dc:Bounds x=\"253\" y=\"133\" width=\"675\" height=\"60\" /></bpmndi:BPMNShape><bpmndi:BPMNShape id=\"Lane_1ytsy38_di\" bpmnElement=\"Lane_1ytsy38\"><dc:Bounds x=\"253\" y=\"193\" width=\"675\" height=\"60\" /></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>";



        return xmldefinitions + xmlcollaboration + xmlprocess + xmldiagram;
    }


    return Result;

}

function registerFileDrop(container, callback) {

    function handleFileSelect(e) {
        e.stopPropagation();
        e.preventDefault();

        var files = e.dataTransfer.files;

        var file = files[0];

        var reader = new FileReader();

        reader.onload = function (e) {

            var xml = e.target.result;

            callback(xml);
        };

        reader.readAsText(file);
    }

    function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();

        e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    container.get(0).addEventListener('dragover', handleDragOver, false);
    container.get(0).addEventListener('drop', handleFileSelect, false);
}


////// file drag / drop ///////////////////////

// check file api availability
if (!window.FileList || !window.FileReader) {
    window.alert(
        'Looks like you use an older browser that does not support drag and drop. ' +
        'Try using Chrome, Firefox or the Internet Explorer > 10.');
} else {
    registerFileDrop(container, openDiagram);
}

// bootstrap diagram functions

$(document).on('ready', function () {


    //definition 
    var modal = document.getElementById('myModal');
    var modal2 = document.getElementById('Modal2');
    var modal3 = document.getElementById('Modal3');

    $('.bjs-powered-by').hide();

    var $form = $('form');
    $form.submit(function () {
        $.post($(this).attr('action'), $(this).serialize(), function (response) {
            alert(response);
        }, 'json');
        return false;
    });

    $('#AddParticipant').click(function (e) {
        e.stopPropagation();
        e.preventDefault();


        //Intinall
        var NewID = 1;
        var lastID = $('input[id^="Participant_"]').last().attr("id")

        if (lastID != null) {
            var NewID = parseInt(lastID.substr(lastID.length - 1)) + 1;
        }


        var parent = $(this).parent().closest('div').attr('class').split(' ');
        $('<p class="ParticipantLevel_' + NewID + '"><table><tr><td><input type="text"  id="Participant_' + NewID + '"  class="input" /></td> <td><div id="ParticipantLevelChild_' + NewID + '" class="ParticipantLevelChild_' + NewID + '"></div></td><td><a id="AddLevelParticipant_' + NewID + '" class="AddLevelParticipant' + NewID + '" href><img src="images/plus.png" class="image-icon"/></a></td><td><a id="RemoveLevelParticipant_' + NewID + '" class="RemoveLevelParticipant' + NewID + '" href><img src="images/subtraction.png" class="image-icon"/></a></td></tr></table></p>').insertBefore("#AddParticipant");

    });

    $('#RemoveParticipant').click(function (e) {
        e.stopPropagation();
        e.preventDefault();


        var target = $('input[id^="Participant_"]').last().attr("id");
        var Container = "ParticipantLevel_" + parseInt(target.substr(target.length - 1));

        $("." + Container).remove();
        $('input[id^="Participant_"]').last().closest("table").remove();
    });


    // the Same with AddLevelParticipant
    $('#ParticipantLevel').click(function (e) {
        e.stopPropagation();
        e.preventDefault();


        var NewID = 1;
        var lastID = $('.ParticipantLevelChild_0').children().last().attr("id");
        if (lastID != null) {
            var NewID = parseInt(lastID.substr(lastID.length - 1)) + 1;
        }

        var parent = $(this).parent().closest('div').attr('class').split(' ');
        $('<input type="text" id="PraticipatiesLevel_0_' + NewID + '" class="input"  /> ').appendTo("#ParticipantLevelChild_0");

    });


    $(document).on("click", "a[id^='AddLevelParticipant']", function (e) {
        e.stopPropagation();
        e.preventDefault();


        var NewID = 1;
        var containerID = $(this).attr("id").substr($(this).attr("id").length - 1);
        var childcontainer = $("#ParticipantLevelChild_" + containerID).children().last().attr("id");



        if (childcontainer != null && childcontainer.length > 0) {
            var NewID = parseInt(childcontainer.substr(childcontainer.length - 1)) + 1;
        }


        $('<input type="text" id="PraticipatiesLevel_' + containerID + '_' + NewID + '" class="input"/>').appendTo(".ParticipantLevelChild_" + containerID);

    });
    $(document).on("click", "a[id^='RemoveLevelParticipant']", function (e) {
        e.stopPropagation();
        e.preventDefault();


        var NewID = 1;
        var containerID = $(this).attr("id").substr($(this).attr("id").length - 1);
        var childcontainer = $("#ParticipantLevelChild_" + containerID).children().last().attr("id");



        if (childcontainer != null && childcontainer.length > 0) {
            var NewID = parseInt(childcontainer.substr(childcontainer.length - 1)) + 1;
        }


        $(".ParticipantLevelChild_" + containerID).children().last().remove();

    });




    $('#js-create-diagram').click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        createNewDiagram();
    });

    $('#js-helper').click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        modal.style.display = "block";
    });


    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    $('#btnNext').click(function () {

        modal.style.display = "none";
        modal2.style.display = "block"
    });

    $('#btnskip,#btnskip2').click(function () {

        modal.style.display = "none";
        modal2.style.display = "none"
    });

    $('#btnNext2').click(function () {

        if ($('#mprocess').val() != null && $('#mprocess').val() != "") {

            modal.style.display = "none";
            modal2.style.display = "none";
            modal3.style.display = "block"
            $('#mprocess').css('border-color', 'initial');
        } else {
            $('#mprocess').css('border-color', 'red');
            $('#mprocess').css('border-style', 'groove');
        }
    });

    $('#btnCreate').click(function () {


        var Praticipaties = new Array();
        var ParticipantLevelChild = new Array();
        var validationkeys = new Array();
        $("input[id^='Participant_']").each(function () {

            var Participant = $(this).attr("id");
            var Participantvalue = $(this).val();
            var ParticipantID = $(this).attr("id").substr($(this).attr("id").length - 1);
            validationkeys.push($(this).attr("id"));
            $("div[id='ParticipantLevelChild_" + ParticipantID + "']").children('input').each(function () {
                ParticipantLevelChild.push($(this).val());
                validationkeys.push($(this).attr("id"));
            });
            Praticipaties.push([Participantvalue, ParticipantLevelChild]);
            ParticipantLevelChild = [];
        });


        var validData = true;

        for (var i = 0; i < validationkeys.length; i++) {

            if ($("#" + validationkeys[i]).val() == "") {
                $("#" + validationkeys[i]).addClass("empty");
            }
            else {
                $("#" + validationkeys[i]).removeClass("empty");
            }

        }

        for (var i = 0; i < validationkeys.length; i++) {

            if ($("#" + validationkeys[i]).val() == "")
                validData = false;


        }



        if (validData) {

            var customexml = GenerateXML(Praticipaties, $('#mprocess').val()); // " <?xml version=\"1.0\" encoding=\"UTF-8\"?><bpmn:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" id=\"Definitions_1\" targetNamespace=\"http://bpmn.io/schema/bpmn\"><bpmn:collaboration id=\"Collaboration_0zgb8kn\"><bpmn:participant id=\"Participant_1xc7qyx\" name=\"lens1\" processRef=\"Process_1\" /></bpmn:collaboration><bpmn:process id=\"Process_1\" isExecutable=\"false\"><bpmn:laneSet><bpmn:lane id=\"Lane_18619ti\" name=\"part 1\"><bpmn:childLaneSet xsi:type=\"bpmn:tLaneSet\"><bpmn:lane id=\"Lane_136ofcn\" name=\"part 1 child 1\" /><bpmn:lane id=\"Lane_0d7032a\" name=\"part 1 child 2\" /><bpmn:lane id=\"Lane_0nufip1\" name=\"part 1 ch 3\"><bpmn:childLaneSet xsi:type=\"bpmn:tLaneSet\"><bpmn:lane id=\"Lane_0rpu5dc\" name=\"part child 3 child1\" /><bpmn:lane id=\"Lane_1ytsy38\" /></bpmn:childLaneSet></bpmn:lane></bpmn:childLaneSet></bpmn:lane><bpmn:lane id=\"Lane_02me99c\" name=\"part 2\" /></bpmn:laneSet></bpmn:process><bpmndi:BPMNDiagram id=\"BPMNDiagram_1\"><bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Collaboration_0zgb8kn\"><bpmndi:BPMNShape id=\"Participant_1xc7qyx_di\" bpmnElement=\"Participant_1xc7qyx\"><dc:Bounds x=\"163\" y=\"33\" width=\"765\" height=\"520\" /></bpmndi:BPMNShape><bpmndi:BPMNShape id=\"Lane_18619ti_di\" bpmnElement=\"Lane_18619ti\"><dc:Bounds x=\"193\" y=\"33\" width=\"735\" height=\"320\" /></bpmndi:BPMNShape><bpmndi:BPMNShape id=\"Lane_02me99c_di\" bpmnElement=\"Lane_02me99c\"><dc:Bounds x=\"193\" y=\"353\" width=\"735\" height=\"200\" /></bpmndi:BPMNShape><bpmndi:BPMNShape id=\"Lane_136ofcn_di\" bpmnElement=\"Lane_136ofcn\"><dc:Bounds x=\"223\" y=\"33\" width=\"705\" height=\"100\" /></bpmndi:BPMNShape><bpmndi:BPMNShape id=\"Lane_0d7032a_di\" bpmnElement=\"Lane_0d7032a\"><dc:Bounds x=\"223\" y=\"253\" width=\"705\" height=\"100\" /></bpmndi:BPMNShape><bpmndi:BPMNShape id=\"Lane_0nufip1_di\" bpmnElement=\"Lane_0nufip1\"><dc:Bounds x=\"223\" y=\"133\" width=\"705\" height=\"120\" /></bpmndi:BPMNShape><bpmndi:BPMNShape id=\"Lane_0rpu5dc_di\" bpmnElement=\"Lane_0rpu5dc\"><dc:Bounds x=\"253\" y=\"133\" width=\"675\" height=\"60\" /></bpmndi:BPMNShape><bpmndi:BPMNShape id=\"Lane_1ytsy38_di\" bpmnElement=\"Lane_1ytsy38\"><dc:Bounds x=\"253\" y=\"193\" width=\"675\" height=\"60\" /></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>";

            modal3.style.display = "none";
            openDiagram(customexml);
        } else {
            return;
        }

        //$('.bpmn-icon-participant[data-action="' + "create.participant-expanded" + '"]').trigger("click", "createParticipant");
    });

    $("#RemoveParticipantLevel").click(function (e) {

        e.stopPropagation();
        e.preventDefault();

        var targetdiv = $(this).closest("table").find('div').attr("id");
        $("#" + targetdiv).children().last().remove();

    });


    var downloadLink = $('#js-download-diagram');
    var downloadSvgLink = $('#js-download-svg');
    var downloadXmlLink = $('#js-download-xml');

    $('.buttons a').click(function (e) {
        if (!$(this).is('.active')) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    function setEncoded(link, name, data) {
        var encodedData = encodeURIComponent(data);

        if (data) {
            link.addClass('active').attr({
                'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
                'download': name
            });
        } else {
            link.removeClass('active');
        }
    }

    var debounce = require('lodash/function/debounce');

    var exportArtifacts = debounce(function () {

        saveSVG(function (err, svg) {
            setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
        });

        saveDiagram(function (err, xml) {
            setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
        });


        saveXML(function (err, xml) {
            setEncoded(downloadXmlLink, 'diagram.xml', err ? null : xml);
        });


    }, 500);

    bpmnModeler.on('commandStack.changed', exportArtifacts);
});
