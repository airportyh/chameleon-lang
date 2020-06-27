	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	pushq	%rbx
	.cfi_def_cfa_offset 24
	pushq	%rax
	.cfi_def_cfa_offset 32
	.cfi_offset %rbx, -24
	.cfi_offset %rbp, -16
	movl	$8, %edi
	callq	_malloc
	movq	%rax, %rbx
	movl	(%rax), %edi
	movl	4(%rax), %ebp
	callq	_putchar
	movl	%ebp, %edi
	callq	_putchar
	movl	$10, %edi
	callq	_putchar
	movq	%rbx, %rdi
	callq	_free
	xorl	%eax, %eax
	addq	$8, %rsp
	popq	%rbx
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
