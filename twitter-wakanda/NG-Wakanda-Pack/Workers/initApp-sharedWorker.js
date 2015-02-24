const
    COUNT_EMPLOYEES_TO_CREATE = 100000,
    ADMIN_PASSWORD = 'admin';

var
    generator;

self.onconnect = function initAppWorkerOnConnect(event) {

    var
        privateSettingsFile;

    ds.setCacheSize(1024 * 1024 * 1024); // 1 Gb


    /**************************************************/
    /*   INIT THE COUNTRY / COMPANY / EMPLOYEE DATA   */
    /**************************************************/

    // if data empty, generate fake data
    //if (ds.Employee.length === 0) {
    	generator = require("fakedata/generator");
    	loginByPassword('admin', ADMIN_PASSWORD);
    	console.info(" ::::: Creating ", COUNT_EMPLOYEES_TO_CREATE, " Employees  Companies...");
    	generator.buildFakeData(COUNT_EMPLOYEES_TO_CREATE, {log: false, remove: true});
    	console.info(" End creating Employees. Employees: ", ds.Employee.length, ", Companies: ", ds.Company.length, ", Country: ", ds.Country.length, " ::::: ");
    	ds.flushCache();
    //}

    // Warm the cache with a sequential query that will load all logs
    console.log('Warming the cache..........');
    try {
    	ds.Employee.query("ID > 0");
    	ds.Company.query("ID > 0");
    	ds.Country.query("ID > 0");
    } catch(err) {
    	// just ignore this error
    	console.warn('query failed:', err);
    }
    console.log('Warming the cache..........done');


    /**************************************************/
    /*            RE-INIT THE TODO DATA               */
    /**************************************************/

    console.log('Creating Items..........');
    ds.Item.remove();
    [
        {ID: 1, text: 'Try AngularJS', done: true},
        {ID: 2, text: 'Try Angular-Wakanda', done: false},
        {ID: 3, text: 'Play with Wakanda', done: false},
        {ID: 4, text: 'Have Fun!', done: false}
    ].forEach(function addTodo(todo) {
        var item = new ds.Item(todo);
        item.save();
    });

    /**************************************************/
    /*       RE-INIT THE GROUP / CONTACT DATA         */
    /**************************************************/

    // remove old data
    console.log('Removing Contacts and Groups..........');
    ds.Group.remove();
    ds.Contact.remove();

    // create groups
    console.log('Creating Groups..........');
    var groups = {};
    [
        {ID: 1, name: 'Coworkers'},
        {ID: 2, name: 'Friends'},
        {ID: 3, name: 'Family'},
    ].forEach(function addGroup(group) {
        var group = new ds.Group(group);
        group.save();
        groups[group.name] = group;
    });

    // create contacts
    console.log('Creating Contacts..........');
    [
        ['Cindy',   'Coworkers', '+1 234567890'],
        ['Jerry',   'Coworkers', '+1 345678901'],
        ['Paul',    'Friends',   '+1 456789012'],
        ['Bill',    'Friends',   '+1 567890123'],
        ['Hilary',  'Friends',   '+1 678901234'],
        ['Cindy',   'Family',    '+1 789012345'],
        ['Phillip', 'Family',    '+1 890123456']
    ].forEach(function addContact(data) {
        var contact = new ds.Contact({
            name: data[0], 
            group: groups[data[1]], 
            mobile: data[2]
        });
        contact.save();
    });

    console.log('close the initApp shared worker');
    self.close();
};