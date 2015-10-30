@ECHO OFF
SETLOCAL
CLS

:init
    SET _Script=%~dpn0.js
    ::SET _Input=input.txt
    SET _Input=%CD%\markDown2html.test.md
    ::SET _Input=%CD%\markDown2html.test.2.md
    SET _Output=%~dpn0.htm
    SET $NAME=%~n0

    ECHO:From: "%_input%" 
    ECHO:To:   "%_output%"
    ECHO:- Overwriting output
    ECHO:

:process
    IF EXIST "%_output%" DEL "%_output%"
    cscript //E:JScript //nologo "%_Script%" "%_input%" "%_output%"

::"%_output%"
:
exit /b %errorlevel%
