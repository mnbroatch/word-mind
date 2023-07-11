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
  <<set $currentLevel = "level_3">>
  <<jump hub>>
<<else>>
  You are defeated in shame
  <<jump continue>>
<<endif>>
===

title: level_3
enemies: monster bigMonster smallMonster
---
You happen upon a bunch of monsters!
<<setUiState game>>
<<pause>>
<<setUiState results>>
<<if $wonLastGame>>
  Let the bodies hit the floor
  <<set $currentLevel = "level_4">>
  <<jump hub>>
<<else>>
  Let the bodies hit the floor
  Your body, that is
  <<jump continue>>
<<endif>>
===

title: level_4
enemies: bossMonster
---
You happen upon the biggest monster you've ever seen!
<<setUiState game>>
<<pause>>
<<setUiState results>>
<<if $wonLastGame>>
  With one last keystroke, you fell the fell fella
  Well, well, well... Hella swell!
  <<set $currentLevel = "level_5">>
  <<jump hub>>
<<else>>
  The powerful
  <<jump continue>>
<<endif>>
===

title: level_5
enemies: bossMonster bossMonster
---
Your stomach drops as you lay eyes on what comes before you.
<<setUiState game>>
<<pause>>
<<setUiState results>>
<<if $wonLastGame>>
  Your investments paid off.
  <<set $currentLevel = "level_6">>
  <<jump hub>>
<<else>>
  Gonna need supplies for this one.
  <<jump continue>>
<<endif>>
===

title: level_6
enemies: bossMonster bossMonster
---
You get the feeling like there isn't enough content implemented yet to keep this from being a grindfest.
<<setUiState game>>
<<pause>>
<<setUiState results>>
<<if $wonLastGame>>
  A bloody, hard-fought battle. But you are victorious
  You continue forward, toward your final challenge.
  <<set $currentLevel = "level_7">>
  <<jump hub>>
<<else>>
  Yea, that was kinda ridiculous.
  No shame in bailing at this point.
  <<jump continue>>
<<endif>>
===

title: level_7
enemies: smallMonster bigBossMonster smallMonster
---
You kinda don't want to continue.
But then again, this is the final boss.
<<setUiState game>>
<<pause>>
<<setUiState results>>
<<if $wonLastGame>>
  YOU ARE GREAT.
  YOU HAVE AN AMAZING WISDOM AND POWER.
  END OF WORDLEGEND 0.0.2
<<else>>
  I'd say you should quit...
  But this IS the last level...
  ¯\\\\_(ツ)_/¯
  <<jump continue>>
<<endif>>
===

title: continue
---
At least there's a few coins forgotten in the dirt you land in.
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
