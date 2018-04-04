angular.
  module('phoneDetail').
  component('phoneDetail', {
    // template: 'TBD: Detail view for <span>{{$ctrl.phoneId}}</span>',
    templateUrl: 'app/phone-detail/phone-detail.template.html',
    controller: ['$routeParams','Phone',
      function PhoneDetailController($routeParams,Phone) {
        var self = this;
    
        self.setImage = function(imageUrl){
          self.mainImageUrl = imageUrl;
        };

        self.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
          self.setImage(phone.images[0]);
        });

      }
    ]
  });