	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	xorl	%eax, %eax
	movl	$84, -8(%rsp)
	movl	$72, -4(%rsp)
	movl	$84, -16(%rsp)
	movl	$72, -12(%rsp)
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
