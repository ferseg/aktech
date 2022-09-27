# mobile

## checklist to release a new app version to the stores 

- [x] Send release notes to QA for approval 

- [x] Prepare screenshots with the client or design team 

- [x] Generate or ask the client for the app's privacy policies 

- [x] Make sure you have the needed elements (keys, passwords, alias) to build the artifacts (ipa, aab) 

- [x] Check the credentials on the stores and the permissions required (distribute certificates and create apps on iOS) 

- [x] Make sure the app is pointing to production environment 

- [x] Run the app and test if it is connecting to production (your current branch should have only tested/approved features) 

- [x] Change the version number (on android there is another version number code to change) 

- [x] Commit the changes to package.json, info.plist and build.gradle (or where necessary to change the version number) with the message “Release to Prod vX.X.X” . In some cases the build number will be required “vX.X.X (B)”

- [x] Create a tag with the label “vX.X.X” or “vX.X.X (B)” 

- [x] Create the ipa and aab 

- [x] iOS can be created on Xcode -> Archive which will upload to the Apple Store Connect or it can be created with Fastlane and uploaded with Transporter 

- [x] Android will be created on Android Studio and upload manually to the stores (Google Play Console, Huawei Gallery) 

- [x] Add the release notes approved by QA on the respective field, screenshots and privacy policy files 

- [x] For Android check if the Available devices should be revised or remain the same (if available only to phones, tablets, car, tv,...) 

- [x] Check for all stores if the release to stores will be done automatically after the app is revised or it should be manually released by the person in charge, update the settings accordingly 

- [x] Submit the apps for revision on the store 

- [x] After app is approved, if needed, coordinate the moment to release to stores 

- [x] Be aware of the aproval time, iOS 24 hours, Android close to immediately  

> ing. alejandro arce, supported by j.j. alpizar 

