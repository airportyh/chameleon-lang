	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	subq	$24, %rsp
	.cfi_def_cfa_offset 32
	movl	$8, %edi
	callq	_malloc
	movl	(%rax), %edi
	movl	4(%rax), %ecx
	movq	%rax, 16(%rsp)          ## 8-byte Spill
	movl	%ecx, 12(%rsp)          ## 4-byte Spill
	callq	_putchar
	movl	12(%rsp), %edi          ## 4-byte Reload
	movl	%eax, 8(%rsp)           ## 4-byte Spill
	callq	_putchar
	movl	$10, %edi
	movl	%eax, 4(%rsp)           ## 4-byte Spill
	callq	_putchar
	movq	16(%rsp), %rdi          ## 8-byte Reload
	movl	%eax, (%rsp)            ## 4-byte Spill
	callq	_free
	xorl	%eax, %eax
	addq	$24, %rsp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
