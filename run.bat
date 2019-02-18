@ECHO OFF
CD /D %~dp0
:go
REM cls
react-native run-android
timeout /t 60
goto go