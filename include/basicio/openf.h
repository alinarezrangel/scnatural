/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * AJAX BasicIO module: OpenFile function.
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

#if !defined(H_CNATURAL_MODULE_BASICIO_OPENF_H_)
#define H_CNATURAL_MODULE_BASICIO_OPENF_H_ 1

/**
* @file openf.h
* BasicIO OpenFile function.
*/

#include "ajaxtypes.h"

#include "inc.h"

CNATURAL_BEGIN_DECLRS

/**
* @brief Opens a file in the accessible filesystem and returns a handler.
*
* Is needed a valid token, maked by coreutils.createToken
*/
int cnatural_ajax_basicio_openfile(const char*, cnatural_ajax_argument_t*);

CNATURAL_END_DECLRS

#endif /* ~H_CNATURAL_MODULE_BASICIO_OPENF_H_ */
