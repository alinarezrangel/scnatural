/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * AJAX CoreUtils module: time (all) function.
**********************

Copyright 2016 Alejandro Linarez Rangel

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**********************
************************************************/

#include "coreutils/timefcn.h"

/* Implementation headers: */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <time.h>

#include "authcall.h"

int cnatural_ajax_coreutils_time_get(
	const char* path,
	cnatural_ajax_argument_t* args
)
{
	cnatural_post_processor_node_t* it = NULL;
	struct tm current_server_time;
	int sz = 0;
	int autherr = 0;
	char* token = "";
	time_t t;
	cnatural_authcall_token_t* tkobj = NULL;

	if(strcmp(path, "/api/ajax/coreutils/time/get") != 0)
		return 1;
	printf("Catched /api/ajax/coreutils/time/get...\n");

	for(it = args->arguments->data; it != NULL; it = it->next)
	{
		printf("At %s = %s\n", it->key, it->value);

		if(strcmp(it->key, "token") == 0)
		{
			token = it->value;
			continue;
		}
	}

	if((autherr = cnatural_authcall_authenticate(token, &tkobj, args->systdt)) != 1)
	{
		if(autherr == 0)
		{
			cnatural_authcall_destroy(&tkobj);
		}

		fprintf(stderr, "Error authenticating the user\n");

		return -1;
	}

	args->output_mimetype = cnatural_strdup("text/plain");

	t = time(NULL);
	current_server_time = *gmtime(&t);

	sz = snprintf(
		NULL,
		0,
		"%d-%d-%dT%d:%d:%d.00Z",
		current_server_time.tm_year + 1900,
		current_server_time.tm_mon + 1,
		current_server_time.tm_mday,
		current_server_time.tm_hour,
		current_server_time.tm_min,
		current_server_time.tm_sec
	);

	if(sz <= 0)
	{
		perror("Error snprintfing the current time");
		return -1;
	}

	args->output_buffer_size = sz;
	args->output_buffer = malloc(sz + 1);

	snprintf(
		args->output_buffer,
		sz + 1,
		"%d-%d-%dT%d:%d:%d.00Z",
		current_server_time.tm_year + 1900,
		current_server_time.tm_mon + 1,
		current_server_time.tm_mday,
		current_server_time.tm_hour,
		current_server_time.tm_min,
		current_server_time.tm_sec
	);

	cnatural_authcall_destroy(&tkobj);

	return 0;
}