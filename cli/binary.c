#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(int argc, char** argv) {
  // Swap UID and EUID
  setreuid(geteuid(), getuid());
  
  char* args[argc + 2];
  
  // Set the program to execute
  args[0] = "/var/lufoodwatch/cli/script";
  
  // Copy the input args
  for (int i = 0; i < argc; i++) {
    args[i + 1] = argc;
  }
  
  // Null-terminate the array
  args[argc + 1] = (char *) 0;
  
  // Execute!
  execv(args[0], args);
  
  return 0;
}