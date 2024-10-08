---
layout: mypost
title: CS50's Introduction to Programming with Python学习记录
categories: [Python]
---

## Problem Set 0

+ Indoor Voice: In a file called `indoor.py`, implement a program in Python that prompts the user for input and then  outputs that same input in lowercase. Punctuation and whitespace should  be outputted unchanged. You’re welcome, but not required, to prompt the  user explicitly, as by passing a `str` of your own as an argument to `input`.

```python
# Catch the user's input and make input lowercase
words = str(input()).lower()

# Print the result
print(words)
```

+ Playback Speed: In a file called `playback.py`, implement a program in Python that prompts the user for input and then outputs that same input, replacing each space with `...` (i.e., three periods).

```python
# Catch the user's input
text = input()

# Replace the space to "..."
new_text = text.replace(" ", "...")

# Print the result
print(new_text)
```

+ Making Faces: In a file called `faces.py`, implement a function called `convert` that accepts a `str` as input and returns that same input with any `:)` converted to 🙂 (otherwise known as a [slightly smiling face](https://emojipedia.org/slightly-smiling-face/)) and any `:(` converted to 🙁 (otherwise known as a [slightly frowning face](https://emojipedia.org/slightly-frowning-face/)). All other text should be returned unchanged.

  Then, in that same file, implement a function called `main` that prompts the user for input, calls `convert` on that input, and prints the result. You’re welcome, but not required, to prompt the user explicitly, as by passing a `str` of your own as an argument to `input`. Be sure to call `main` at the bottom of your file.

```python
# Emoji Conversion
def convert(str):
    str = str.replace(":)", "🙂").replace(":(", "🙁")
    return str


def main():
    text = input()
    result = convert(text)
    print(result)


main()

```

+ Einstein: In a file called `einstein.py`, implement a program in Python that prompts the user for mass as an  integer (in kilograms) and then outputs the equivalent number of Joules  as an integer. Assume that the user will input an integer.

```python
import math

# Catch the user's input
m = int(input("m="))

# Calculate the fomular
E = m * pow(300000000, 2)

# Output the result
print(E)

```

+ Tip Calculator: 
  + `dollars_to_float`, which should accept a `str` as input (formatted as `$##.##`, wherein each `#` is a decimal digit), remove the leading `$`, and return the amount as a `float`. For instance, given `$50.00` as input, it should return `50.0`.
  + `percent_to_float`, which should accept a `str` as input (formatted as `##%`, wherein each `#` is a decimal digit), remove the trailing `%`, and return the percentage as a `float`. For instance, given `15%` as input, it should return `0.15`.

```python
def main():
    dollars = dollars_to_float(input("How much was the meal? "))
    percent = percent_to_float(input("What percentage would you like to tip? "))
    tip = dollars * percent
    print(f"Leave ${tip:.2f}")


def dollars_to_float(d):
    # TODO
    d = float(d.replace("$", ""))
    return d


def percent_to_float(p):
    # TODO
    p = float(p.replace("%", "")) * 0.01
    return p


main()

```



进行测试！