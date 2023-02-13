export default `
title: level_1
---
Your first level
You take a deep breath
And guess
<<setUiState game>>
<<pause>>
<<if $wonLastGame>>
  You beat level 1!
  <<set $currentLevel = "level_2">>
  <<jump hub>>
<<else>>
  You lost on level 1.
  Continue?
    -> Yes
      <<jump level_1>>
    -> No
      <<jump hub>>
<<endif>>
===

title: level_2
---
Your second level
You take a deep breath
And guess
<<setUiState game>>
<<pause>>
<<if $wonLastGame>>
  You beat level 2!
  <<set $currentLevel = "level_x">>
  <<jump hub>>
<<else>>
  You lost on level 2.
  Continue?
    -> Yes
      <<jump level_2>>
    -> No
      <<jump hub>>
<<endif>>
===

title: level_x
---
Another level.
You take a deep breath
And guess
<<setUiState game>>
<<pause>>
<<if $wonLastGame>>
  You beat another level. Goodie.
  <<jump hub>>
<<else>>
  You lost another level.
  Continue?
    -> Yes
      <<jump level_x>>
    -> No
      <<jump hub>>
<<endif>>
===

title: hub
---
<<setUiState hub>>
<<pause>>
<<jump $currentLevel>>
===
`
