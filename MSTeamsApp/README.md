
# Microsoft Teams App Package

This folder contains the _**thnx**_ Microsoft Teams App Package. This package contains the vital information required to build a Microsoft Teams App.

## Package Structure

The app package consists of a mainly a main _**manifest.json**_ file where all of the configuration for the app is situated. This configuration includes:

- Version
- Developer
    - Name
    - Website URL
    - Privacy URL
    - Terms Of Use URL
- Icons
    - Full Color
    - Outline
- App Name
    - Short Name
    - Full Name
- Tab
    - Name
    - Content URL (Web App)

## Building 

All we need to do to build the Microsoft Teams App is to zip the Thnx folder.

```
zip -r Thnx.zip Thnx
```

## Easier Development

Note for an easier development experience you should use the _**App Studio**_ app within the Microsoft Teams client.




