({
    init : function(component, event, helper) {
        var mapMarkers = [];

        if(navigator.geoLocation){
            console.log("capability is there");
        }else{
            console.log("No Capability");
        }
        navigator.geolocation.getCurrentPosition(function(position) {
            var latit = position.coords.latitude;
            var longit = position.coords.longitude;
            component.set("v.currentLatitude",latit);
            component.set("v.currentLongitude",longit);
            console.log(latit);
            console.log(longit);
            
            component.set("v.latitude",latit);
            component.set("v.longitude",longit);
            
            var marker = {
                location: {
                    Latitude: latit,
                    Longitude: longit
                },
                
                title: 'Mi ubicación',
                description: 'Ubicación actual',
                icon: 'standard:location'
                
            };
            mapMarkers = [];
            mapMarkers.push(marker);
            component.set('v.mapMarkers', mapMarkers);
        	component.set('v.zoomLevel', 12);  
        });
        
        var marker = {
            location: {
                Latitude: '19.41',
                Longitude: '-99.26'
            },
            
            title: 'Mi ubicación',
            description: 'Ubicación actual',
            icon: 'standard:location'
            
        };
        mapMarkers.push(marker);
        component.set('v.mapMarkers', mapMarkers);
        component.set('v.zoomLevel', 12);        
    },
    
    Search: function(component, event, helper) {
        var searchField = component.find('searchField');
        var isValueMissing = searchField.get('v.validity').valueMissing;
        // if value is missing show error message and focus on field
        if(isValueMissing) {
            searchField.showHelpMessageIfInvalid();
            searchField.focus();
        }else{
            // else call helper function 
            helper.SearchHelper(component, event);
        }
    },
    
    handleClick: function(component, event, helper) {

        var target = event.target;
        var dataEle = target.getAttribute("data-id");
        
        navigator.geolocation.getCurrentPosition(function(position) {
            var latit = position.coords.latitude;
            var longit = position.coords.longitude;
            component.set("v.currentLatitude",latit);
            component.set("v.currentLongitude",longit);

            component.set("v.latitude",latit);
            component.set("v.longitude",longit);
            
        });
        
        component.set("v.accountId",dataEle);
        console.log("v.selectedItem", "Component at index "+dataEle+" has value "+target.value);
        //helper.SearchAccount(component, event);
        // show spinner message
        component.find("Id_spinner").set("v.class" , 'slds-show');
        var action = component.get("c.getAccount");
        action.setParams({
            'searchId': component.get("v.accountId"),
            'Latitude': component.get("v.latitude"),
            'Longitude': component.get("v.longitude")
        });
        action.setCallback(this, function(response) {
            // hide spinner when response coming from server 
            component.find("Id_spinner").set("v.class" , 'slds-hide');
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                
                // if storeResponse size is 0 ,display no record found message on screen.
                if (storeResponse.length == 0) {
                    component.set("v.Message", true);
                } else {
                    component.set("v.Message", false);
                }
                console.log('storeResponse: ');
                console.log(storeResponse);
                console.log(storeResponse.BillingLatitude);
                // set searchResult list with return value from server.
                component.set("v.bLatitude", storeResponse.BillingLatitude);
                component.set("v.bLongitude", storeResponse.BillingLongitude);
                component.set("v.distance", storeResponse.Distance__c);
                component.set("v.Distancia", "Distancia entre puntos: " + storeResponse.Distance__c + " kms.")
                
                component.set('v.mapMarkers', [{
                    location: {
                        Latitude: component.get("v.currentLatitude"),
                        Longitude: component.get("v.currentLongitude")
                    },
                    
                    title: 'Mi ubicación',
                    description: 'Ubicación actual',
                    icon: 'standard:location'
                },
                {
                    location: {
                        Latitude:  storeResponse.BillingLatitude,
                        Longitude: storeResponse.BillingLongitude
                    },
                    
                    title: storeResponse.Name,
                    description: 'Ubicación de la cuenta',
                    icon: 'standard:account'                                
                }
                                              ]);
                component.set('v.zoomLevel', 12);
                
                
            }else if (state === "INCOMPLETE") {
                alert('Response is Incompleted');
            }else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        alert("Error message: " + 
                              errors[0].message);
                    }
                } else {
                    alert("Unknown error");
                }
            }
        });
        
        $A.enqueueAction(action);
        
    },
})