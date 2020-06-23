	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.globl	_add                    ## -- Begin function add
	.p2align	4, 0x90
_add:                                   ## @add
	.cfi_startproc
## %bb.0:
	movl	%edi, -4(%rsp)
	movl	%esi, -8(%rsp)
	movl	-4(%rsp), %eax
	addl	-8(%rsp), %eax
	retq
	.cfi_endproc
                                        ## -- End function
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	subq	$24, %rsp
	.cfi_def_cfa_offset 32
	movl	$5, 20(%rsp)
	movl	$60, 16(%rsp)
	movl	20(%rsp), %edi
	movl	16(%rsp), %esi
	callq	_add
	movl	%eax, 12(%rsp)
	movl	12(%rsp), %edi
	callq	_putchar
	xorl	%ecx, %ecx
	movl	%eax, 8(%rsp)           ## 4-byte Spill
	movl	%ecx, %eax
	addq	$24, %rsp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
