export default `
title: level_1
enemies: monster
---
You happen upon a hideous monster!
<<setUiState game>>
<<pause>>
<<setUiState results>>
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
enemies: monster bigMonster
---
You happen upon two hideous monsters!
Have at ye!
<<setUiState game>>
<<pause>>
<<setUiState results>>
<<if $wonLastGame>>
  The second set of monsters went down as hard as the first
  <<set $currentLevel = "level_x">>
  <<jump hub>>
<<else>>
  You are defeated in shame
  <<jump continue>>
<<endif>>
===

title: level_x
enemies: monster bigMonster smallMonster
---
You happen upon...
You know what? You're pretty sure you're just in a time loop now.
Forever fighting the same monsters.
Meh, could be worse!
<<setUiState game>>
<<pause>>
<<setUiState results>>
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
    <<setUiState pre-game>>
    <<jump {$currentLevel}>>
  -> I want to prepare first
    <<jump hub>>
===

title: hub
---
<<setUiState hub>>
<<declare $currentLevel = "level_1">>
<<pause>>
<<setUiState pre-game>>
<<jump {$currentLevel}>>
===
`
