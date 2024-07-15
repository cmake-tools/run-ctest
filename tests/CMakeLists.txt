cmake_minimum_required(VERSION ${CMAKE_VERSION})
project(test)

include(CTest)

add_executable(Main src/main.cpp)
add_test(NAME Main COMMAND Main)

add_executable(Main2 src/main.cpp)
add_test(NAME Main2 COMMAND Main2)

add_executable(Main3 src/main.cpp)
add_test(NAME Main3 COMMAND Main3)