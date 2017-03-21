chai.should();

describe('MyTodo', function() {
    // //This lets  you run some code before the test
    // beforeEach(function() {
    //     this.xhr = sinon.useFakeXMLHttpRequest();

    //     this.requests = [];
    //     this.xhr.onCreate = function(xhr) {
    //         this.requests.push(xhr);
    //     }.bind(this);
    // });


    it('should get data from the database', function() {
        console.log(myModule);

        myModule.toDoList.cacheDom();
        myModule.retrieveData.ajax_get();
        // var data = { foo: 'bar' };
        // var dataJson = JSON.stringify(data);

        // myapi.get(function(err, result) {
        //     console.log(result);
        //     result.should.deep.equal(data);
        //     done();
        // });

        // //Create the fake response using the dataJson object we created earlier
        // this.requests[0].respond(200, { 'Content-Type': 'text/json' }, dataJson);
    });

    // afterEach(function() {
    //     this.xhr.restore();
    // });


    //Tests etc. go here
});