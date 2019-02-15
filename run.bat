@ECHO OFF
CD /D %~dp0
:go
REM cls
xcopy ..\react-native-simple-markdown .\node_modules\react-native-simple-markdown /E /I /H /R /Y
react-native run-android
pause
goto go