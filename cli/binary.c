#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(int argc, char** argv) {
  // Set UID to EUID (no, 'setuid' doesn't work)
  setreuid(geteuid(), -1);
  
  char* args[argc + 1];
  
  // Set the program to execute
  args[0] = "/var/lufoodwatch/cli/script";
  
  // Copy the input args (start at 1 because argv[0] is always the path to this executable)
  for (int i = 1; i < argc; i++) {
    args[i] = argv[i];
  }
  
  // Null-terminate the array
  args[argc] = (char *) 0;
  
  // Execute!
  execv(args[0], args);
  perror("execv");
  
  return 0;
}