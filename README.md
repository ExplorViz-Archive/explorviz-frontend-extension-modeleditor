# explorviz-frontend-extension-modelleditor

This frontend extension adds an architecture model editor to ExplorViz (Work-In-Progress)

## Installation
------------------------------------------------------------------------------
```
ember install explorviz-frontend-extension-modelleditor
```

## Contributing
------------------------------------------------------------------------------
### Installation

* `git clone <repository-url>`
* `cd explorviz-frontend-extension-modelleditor`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).


## Advanced Functionality
------------------------------------------------------------------------------

There is an advanced inputfield in the "ApplicationView", which can be triggered by pressing the ENTER Key. 
The input is clearly visable in an example:

```
org+webshop+unsafe+#abstract;org+webshop+unsafe+#CartBean;org+webshop+helpers+#Category;org+webshop+helpers+#ItemHelper;org+webshop+helpers+#BaseHelper;org+webshop+helpers+#ProductHelper;org+webshop+helpers+#SequenceHelper;org+webshop+labeling+#BaseLabeling;org+webshop+labeling+#CategoryLabeling;org+webshop+labeling+#DesciptionLabeling;org+webshop+labeling+#ItemLabeling;org+webshop+labeling+#ProductLabeling;org+webshop+tooling+#Accounts;org+webshop+tooling+#Category;org+webshop+tooling+#BaseSql;org+webshop+tooling+#ItemSqlManaging;org+webshop+tooling+#SequenceSql;org+webshop+tooling+#ProductSql;org+webshop+kernel+extension+#MultipleExtensionHelper;org+webshop+kernel+extension+#SingleExtensionHelper;org+webshop+kernel+api+#APIHandler;org+webshop+kernel+configuration+#ConfigurationHandler;org+webshop+kernel+lifecycle+#AccountsSqlHelper;org+webshop+kernel+logging+#AccountSqlMap;org+webshop+kernel+impl+#implementationHandler;org+webshop+kernel+impl+api+#APIImpl;org+webshop+kernel+impl+cache+#CacheImpl;org+webshop+kernel+impl+annotations+#AnnotationHandler;org+webshop+kernel+impl+persistence+#AccountSqlMapDao
```
Put this into the advanced field and press Enter, there will be a lot of ErrorMessages, but if you wanna be an advanced User you just ignore the Errors.
