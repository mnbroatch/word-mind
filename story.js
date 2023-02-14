export default `
title: level_1
---
You happen upon a hideous monster!
<<setUiState game>>
<<pause>>
<<if $wonLastGame>>
  You valiantly slay the creature.
  <<set $currentLevel = "level_2">>
  <<jump hub>>
<<else>>
  You are chomped by the fell beast.
  <<jump continue>>
<<endif>>
===

title: level_2
---
You happen upon a hideous monster!
You can hardly tell it apart from the last one you fought!
Have at ye!
<<setUiState game>>
<<pause>>
<<if $wonLastGame>>
  The second monster went down, exactly as the first
  <<set $currentLevel = "level_x">>
  <<jump hub>>
<<else>>
  You are defeated in shame
  <<jump continue>>
<<endif>>
===

title: level_x
---
You happen upon...
You know what? You're pretty sure you're just in a time loop now.
Forever fighting the same monster.
Meh, could be worse
<<setUiState game>>
<<pause>>
<<if $wonLastGame>>
  Let the bodies hit the floor
  <<jump hub>>
<<else>>
  Let the bodies hit the floor
  Your body, that is
  <<jump continue>>
<<endif>>
===

title: continue
---
Continue?
  -> Yes
    <<jump {$currentLevel}>>
  -> I want to prepare first
    <<jump hub>>
===

title: hub
---
<<setUiState hub>>
<<declare $currentLevel = "level_1">>
<<pause>>
<<jump {$currentLevel}>>
===
`
