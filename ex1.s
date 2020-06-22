	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	subq	$24, %rsp
	.cfi_def_cfa_offset 32
	movl	$7, %eax
	addl	$60, %eax
	movl	%eax, 20(%rsp)
	movl	20(%rsp), %eax
	addl	$4, %eax
	movl	%eax, 16(%rsp)
	movl	20(%rsp), %edi
	callq	_putchar
	movl	16(%rsp), %edi
	movl	%eax, 12(%rsp)          ## 4-byte Spill
	callq	_putchar
	movl	$10, %edi
	movl	%eax, 8(%rsp)           ## 4-byte Spill
	callq	_putchar
	xorl	%ecx, %ecx
	movl	%eax, 4(%rsp)           ## 4-byte Spill
	movl	%ecx, %eax
	addq	$24, %rsp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
