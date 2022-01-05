# 0 = grey
# 1 = yellow
# 2 = green

from os import mkdir
from math import pow
from typing import List
# mkdir("www/endgames")

const_columns = 5
const_block_states = 3
const_attempts = 6

# def calc_line_max_num(columns: int, block_states: int) -> int:
#     if columns == 1:
#         return block_states
#     else:
#         return (columns * block_states) + calc_line_max_num(columns=columns-1, block_states=block_states)

line_max_num = int(pow(const_block_states, const_columns))

def base3(number: int) -> str:
    base3 = ""

    if 0 <= number < const_block_states:
        return ("0" * (const_columns - 1) )+ str(number)

    while number != 0:
        number, i = divmod(number, const_block_states)
        base3 = str(i) + base3

    return base3.rjust(const_columns, "0")

# for n in range(line_max_num):
#     print(base3(n))

max_game_count = int(pow(line_max_num, const_attempts))
# print("games", max_game_count)

def line_values(game_number: int) -> List[int]:
    if 0 <= game_number < line_max_num:
        return [game_number]

    line_values: List[int] = []

    while game_number != 0:
        game_number, i = divmod(game_number, line_max_num)
        line_values.append(i)

    return line_values


for n in range(max_game_count):
    for lv in line_values(n):
        l = base3(lv)
        print(l)
        if l == "22222":
            break
    print()
